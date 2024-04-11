const { promisify } = require('util'); //a build in promisify function is in node libary -> make it return promise.
//es6-distructaring
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
//const catchAsync = require('../utils/catchAsync'); // a function that we made instead of trycatch
const AppError = require('../utils/appError');

// A global jwt creation function, to save us some time
const signToken = (id) => {
  //           the user is that was created     THE secret key we generated
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    //the settings to the jwt
    expiresIn: process.env.JWT_EXPIRING_IN, //the expiring time that we have set inside of the proccess.env
  });
};

exports.singup = async (req, res, next) => {
  try {
    //* this setup is saying that we can sighn in as admin , it also make every person that will try to connect as admin
    //const newUser = await User.create(req.body); // in here we are passing an object with the data to the user that we are creating
    //* this setup will make sure that only real person can connect not as admins , and if we want to connect as admin , ve can basicly create us an user in mongoose and use it from there
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt, //FOT THE OPTION OF CHEKING
    });
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1) Check if email and password is exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    //2) Check if user exist  && password is currect
    //                        the field+the verible , we need to put + and then the name of the verible to the selcet to work
    const user = await User.findOne({ email }).select('+password'); //selcet the fields from the db that we need
    //*we finding by email and not by id
    //(we comparing the byctpy package in the model , becouse there we have the package imported and also it related to the data so we implemnting this there )
    //const correct = await user.correctPassword(password, user.password); //this will be eidegher true or false --> we moved this verible becouse eiegher way if there no user.password it will not pass, so we saved some code here..

    if (!user || !(await user.currectPassword(password, user.password))) {
      //in this vake this is vake , we not specify what is incorrect for security methods
      return next(new AppError('Incorrect email or password ', 401));
    }

    //3) If everything ok, send token to client
    const token = signToken(user._id);
    return res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
};

//a middleware function that will check if the token valid and protect the routes that we selceted
exports.protect = async (req, res, next) => {
  try {
    //1) Getting token and check if its there,        startsWith-> js function that check the first lorem of the sentence
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //now we need to split between the Bearer and the actual tooken in order to get access to the actual token that has been sent to us from the req.headers
      token = req.headers.authorization.split(' ')[1]; //we want the seconed element from the array
    }

    // console.log(token);
    //check if the token exist :
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    //2) Validate token - verification
    //[ a function that we need to call  whitch then return a promise  ] || [  in here we actually caliing the function ]
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //promisify-> a build in function in node libary -> make it return promise.
    // console.log(decoded); // in here we getting the current use id from db , and also we geting the date it was created and the expring time
    //for exmaple : { id: '66082d7512571462f0d9ffe9', iat: 1712842541, exp: 1720618541 } -> this what we geting from decoded after getting an access to protected route
    //this id is matching to the user id in compass

    // TODO: !!!! Message !!!!
    //instead of doing tryblock to decoted , we doing in this proccess :
    //  we specify in the err handeler middleware that if there an JsonWebTokenError ,(like fake one , invalid one ) on prod mode then it will display to the client an nice envalid message
    //                      -------------------------               ------------------------------------------------                       -----------------------------------------------------

    //---! for more security cheking examples:
    //3) Check if user still exist
    // *  what if the a user has been deleted and in the meanwhile the token still exist  , if there no user we dont want him to log in
    // * what if the user hase changes his password after the token has been issued
    // * someone stole the jsonwebtoken from the user and the user in order to protect from that ,changes his password - the token that has benn giving before the password chanhged need to be issued
    // query the user by id
    const currentUser = await User.findById(decoded.id); // finding the user in the db by it id -> serching the user by the id of the decoded

    // if there no id that match in the decoded to the db then log him out with an err message
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this user does not longer exist. ',
          401
        )
      );
    }
    //4) Check if user changed password after the token was issued
    //* to check that we will create a new instance method that will be isuued for all documents in the model  , documents are instanses of a model

    //                 iat: 1712842541 like in the exmple below
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      // * if the user is actualy changed their password so then we want this err to happen
      // * if the password was actually changed so we want an error
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    //GRAND ACCESS TO PROTECTED ROUTE
    // put the intire user data on the req:
    req.user = currentUser; // we puting inside req.user the new user data!, that way the data will be avaible in next middleware function , this req bject travels from middleware to middleware
    next();
  } catch (error) {
    next(error);
  }
};
