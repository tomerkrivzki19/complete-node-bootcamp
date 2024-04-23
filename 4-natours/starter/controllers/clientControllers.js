const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//                       rest paramters for the allowed fields -. will create an array with all the elemnts we passed in
const filterObj = (obj, ...allowedFields) => {
  //need to loop and check if it contanis from the allowed fields and if it sinple add it to a new object that we will return in the end

  const newObj = {};
  //one of the easy ways to loop threw an object in js
  Object.keys(obj).forEach((el) => {
    //if the allowedFields arrays incloudes the current element(field name) we want to add the to a newObj with the current field should be equal to whatever in the ibejct with the current field name
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllClients = async (req, res) => {
  try {
    const Users = await User.find();

    res.status(200).json({
      status: 'success',
      results: Users.length,
      data: {
        Users,
      },
    });
  } catch (error) {
    next(error);
  }
};
//updating the user data
exports.updateMe = async (req, res, next) => {
  try {
    //1) Create an err if the user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword',
          400
        )
      );
    }

    // Update the user document -> if not POSTs password data !
    // const user = await User.findById(req.user.id);
    // user.name = 'Jonas';
    // await user.save();
    //this proccess will not work ! becouse passeordConfirm is a required field but we did not specify it inside of the req
    //this is why the save() proccess is not accurade in this function

    //what we can do now is findByIdAndUpdate -> we cannot use that anywhere when we are messing around with passwords ,
    //but in this exmaple we dont tutch password at all , and this is why using here the findByIdAndUpdate method will work perectly , ( here we are using not-sensative data like mail or email  )
    //                                                 findById ,the data , options | the data we want to update with

    //why we put out x inwted of req.body -> that becouse we dont want to update everything that in the body, for example if the user type indie the body the role , this will allow to any user change to the administrator , and that should be not allowed ! and  more exmples like restart token etc...
    // we need to make sure that the body contains only name and email ptoparties , becouse for now they are the only things we want to allow to update --> for that we want to filter the body to contain only fields of email and name !
    //for example if the user wont to change the role it will be filtert that way that the output will display only proparties of email and name and that way , the data like role and other stuff in the body will not saved into the database

    //2)Filtered out unwanted names that are not allowed to be updated
    //the value that the client type inside the body |the proparties we want to filter of
    const filteredBody = filterObj(req.body, 'name', 'email'); //we will add some more stuff later like image and more..

    //3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true, //will return us the new object menas the updated object  instead of the old one
        runValidators: true, //we want mongoose to validate out data becouse if we put in invalid email adress that should be catch by the validaor  and return an err
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createClient = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};

exports.deleteMe = async (req, res, next) => {
  //                                    the data we want to update
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    message: null,
  });
};
exports.getClient = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
exports.updateClient = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
