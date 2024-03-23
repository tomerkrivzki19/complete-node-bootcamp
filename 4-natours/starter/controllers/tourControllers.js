const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const toursFile = JSON.parse(
//   fs.readFileSync('../starter/dev-data/data/tours-simple.json')
// );

// exampple of middleware::
// exports.checkBody = (req, res, next) => {
//   let { name, price } = req.body;
//   if (!name || !price) {
//     return res.status(400).json({
//       status: 'faild',
//       message: 'not vaild',
//     });
//   }
//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   console.log(`tour id is : ${val}`);

//   if (req.params.id * 1 > toursFile.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'something went wrong',
//       //this message is also a security mesaage that no to give ant inforamtion to hackers that tring to collect inforamtion about my client for examaple
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// **** To make our code more arrange we can to make a callback function out side the request's and that will make to use more understand the code more then when the callbacks function are inside the reqeust's.
exports.getAllTours = async (req, res) => {
  // all of this is moved to utils inside a class there we just create an object with all of this fuction as methods and just basicly shoterd and made the code more arregend
  //here is basicly all of the explenation of the code and the function , just to make it clear to understand
  try {
    console.log(req.query);
    // BUILD QUERY
    // before the implementaion of query we can selct some text that we dont want it to count when it filter by the param in the url
    //like for example we can define that page will be removed when its located inside the path

    //1A) FILTERING
    // const queryObj = { ...req.query };
    // //                  first distruction -->creating a new object with the new iploaded content inside the verible, in this case he will bring a updated new object
    // const exculdedFields = ['page', 'sort', 'limit', 'fields'];
    // exculdedFields.forEach((el) => delete queryObj[el]);

    // //to make filter when we adding some query to the url we  need to add filter option inside the function
    // //the first option is to make it with the regular find options :

    // //     const query = await Tour.find({
    // //  duration: 5,
    // //difficulty:'easy
    // // });
    // //

    // //1B) ADVANCE FILTERING
    // let queryStr = JSON.stringify(queryObj);

    // // the quey we gerring and the query we need to set
    // // { difficulty : 'easy',duration : { $gte: 5 }} --->what we need to create to oprate the filter param option
    // // { difficulty : 'easy',duration : { gte: 5 }}  --->what we getting in actual

    // //the query we neet to set $ to this kind of words
    // // gte ,gt,lte,lt

    // // "gte" stands for "greater than or equal to". It checks if a value is greater than or equal to another value.
    // // "gt" stands for "greater than". It checks if a value is strictly greater than another value.
    // // "lte" stands for "less than or equal to". It checks if a value is less than or equal to another value.
    // // "lt" stands for "less than". It checks if a value is strictly less than another value.
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // //finally we have the best solution to query every parameter with that option:
    // let query = Tour.find(JSON.parse(queryStr));
    // // this is simaply serch for all the query paramters

    // 2) SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' '); //.split-> after the , it will give us the value
    //   query = query.sort(sortBy); //.join->connecting the words toghther //מחלק ומחבר פשוט ולעניין
    // } else {
    //   //it will oredered by the date they have been created
    //   query = query.sort('-createdAt');
    // }

    // 3)FIELS LIMITING
    // if (req.query.fields) {
    //   //if we have fields paramter ==> select the values that has been typed inside the fields paramater and send back the result only contain that
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields); //called projecting --//.select ->
    // } else {
    //   query = query.select('-__v '); // the minus role is not inclouding but exscluding
    //   // exscluding --> meaning is to hide the paramter in this cace in the url path when showing present this to the client
    //   // we can use it when we dont want the user will knew when the tour was created and hide it from him
    //   //another example is to hide the user password when displaying the data - we can basily definf it inside the schema
    // }
    // 4)PAGINATION                 //the or option is the defult we setiing to the user if there is not limit | page set
    // const page = req.query.page * 1 || 1; // make te defult to one , and if there is a string on the req.query.page it will convert to num.
    // const limit = req.query.limit * 1 || 100; //the user we only specify the page number that she reqeust not even bodeer with the limit this is for more specific use cases
    // const skip = (page - 1) * limit; // the prviose page multiplied by the limit that the user sets
    // // this number here is all the results that come before the page we are acctualy reqeusting now.
    // //page=2&limit=10 -- results on to 10 on page one and eleven to twenty on page two - we want to slip 10 reslut before quering 1-10 page 1 11-20 page 2 21-30 page 30
    // //query = query.skip(10).limit(10); //limit ==> the ammount of results that we want inside te query | skip==the ammount of results that we want to skip before quering the data
    // //explanation - to enter page 2 and limit of 10 we need basicly to skip 10 and limit 10 , that way the page 2 will sets us 10 obects of the api we are controlling with

    // query = query.skip(skip).limit(limit);
    // //   num of skiping results  d  the num of result

    // //to handle things like when there is no more results to display to client
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments(); // return the number of documents --> return a promise then we need to wait to the result
    //   if (skip >= numTours) throw new Error('This page does not exist'); //if the nummber of documents that we skip is greater then the number of documnets that actualy exist then that means the page does not exist
    // }

    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query) //WILL GET ACCESS TO ALL CLASS DEFINATIONS
      .filter() //all of this chaning here is working becouse we returned this , and we are makeing the methods to continue run without stoping and sending null
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    //quey.sort().select().skip().limit()

    // the seconed option is to make a filter with mongoose option :

    // const tours = await Tour.find()
    //.where('duration')
    // .equals(5)
    //.where(difficulty)
    // .equals("easy")
    // console.log(req.requestTime);

    //SEND RESPONDE
    res.status(200).json({
      status: 'success',
      // reqestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};
exports.getTour = /*catchAsync(*/ async (req, res, next) => {
  //for the try and catch req:
  try {
    const tour = await Tour.findById(req.params.id);
    //                 Tour.findOne({_id : req.params.id})
    //for the 404 cases -- in this case we pass the error to the error handler and then pass them 404 error
    if (!tour) {
      return next(new AppError('No tour found with that ID ', 404)); // we seting return becouse we want to return this function imidiatly and not move on to the next line , and willl run two responses
      //the err object that we created
      //what happend here is , that when we passing to next an argument it will return a error , and that err will passed to the error middleware handler that we created
    }
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  } catch (error) {
    //regular solution for try and catch
    // res.status(404).json({
    //   status: 'failed',
    //   message: error,
    // });

    //solution for the middleware err funtion
    next(error);
  }

  //SOLUTION FOR THE CATCHASYNC FUNCTION :
  // const tour = await Tour.findById(req.params.id);
  // //                 Tour.findOne({_id : req.params.id})
  // //for the 404 cases -- in this case we pass the error to the error handler and then pass them 404 error
  // if (!tour) {
  //   return next(new AppError('No tour found with that ID ', 404)); // we seting return becouse we want to return this function imidiatly and not move on to the next line , and willl run two responses
  //   //the err object that we created
  //   //what happend here is , that when we passing to next an argument it will return a error , and that err will passed to the error middleware handler that we created
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tour,
  //   },
  // });
  // --------------------------------------------

  // console.log(req.params);
  // const id = req.params.id * 1;
  // we done this becouse on the params output we have the outpot as a string , so on this js trick we converting the string to a number
  // const tour = toursFile.find((el) => el.id === id);
  // if there are not sutch as existing id , then we need to make sure that the client not gets a 200 status code and also make sure that there is the right message for the client side
  //first solution --
  // if (id > toursFile.length) {
  //seconed solution -- is more speesific to our case
  // if (!tour) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'somthing went wrong',
  //     //this message is also a sequrity mesaage that no to give any inforamtion to hackers that tring to collect inforamtion about my client for examaple
  //   });
  // }
}; //);

//what we have done here in this example is that we wrap our asyncfunction inside of the catchAsync funtion => this function will return a new anonimuse funnction (the function that inside of the return ) and then will be assing to create tour handaler
exports.createTour = catchAsync(async (req, res) => {
  //example of req handlare with try and catch
  // try {
  //   const newTour = await Tour.create(req.body);
  //   console.log(newTour);
  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(400).json({
  //     status: 'failed',
  //     message: 'Invaild data sent!',
  //   });
  // }
  //EXAMPLE OF REQ WITH THE CATCH-AYSNC FUNCTION -> that was made to replace our try and catch function and move the err to the err handalere that we created
  const newTour = await Tour.create(req.body);

  console.log(newTour);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // console.log(req.body);
  // const newId = toursFile[toursFile.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // toursFile.push(newTour);
  // fs.writeFile(
  //   '../starter/dev-data/data/tours-simple.json',
  //   JSON.stringify(toursFile),
  //   (err) => {
  //     res.status(201).send({
  //       status: 'success',
  //       data: {
  //         tours: newTour,
  //       },
  //     });
  //   }
  // );
  // res.send('done!');
});

exports.updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, //mybe mot working -not sure becouse mongoose dont eccept new changes in the schema
    });

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    // res.status(404).json({
    //   status: 'failed',
    //   message: error,
    // });
    next(error);
  }

  // if (req.params.id * 1 > toursFile.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'something went wrong',
  //     //this message is also a security mesaage that no to give ant inforamtion to hackers that tring to collect inforamtion about my client for examaple
  //   });
  // }
};
exports.deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    //                  לקבץ
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          //what it does basicly it will run each and each document and will count and group all the counter we selected in the option with the monngose methods that we are selected

          //allow us to grop documnets toghether using acumilators -> acumilator is can for example canculate an avergae for example if we have five tours and each of them have an rating we can canculate the avergae rating using $group
          //_id: '$difficulty', // it will group all the documents by thier difficulty
          // _id: '$ratingsAverage',
          _id: { $toUpper: '$difficulty' }, //toUpper ->  spelling uppercase
          numTours: { $sum: 1 }, //for each of the document that going to go threw the pipe lline one will be added to this numTours counter
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' }, //an operator that canculatong the average and now the name of the field
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 }, //the old names we cannot use them becuse in this point they already done , so instead we will use the number 1 for assending
      },
      // {
      //   //we can reped stages
      //   $match: { _id: { $ne: 'EASY' } }, //$ne => not equal, WE WILL SELECT ALL THE DOCUMENTS THAT ARE NOT EASY,DISCUULDING EASY
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  //example for a real companies issue | needs
  //that we need to implement a function to canulate the busiest month  of a giving year--canculating how many tours start in each of the month of the giving year
  //the company realy need this function to prepare accordingly for those tours - like buy a tour guy or buy an a equipment or stuf like that
  //to solve this a pipe line could help us solve this issue |need..
  try {
    const year = req.params.year * 1; //the trick to trasform this to a number
    //the year selceted 2021
    const plan = await Tour.aggregate([
      {
        // what we are doing in here we are distracting the startDates inside all the documnts , and instead of 9 documents elemnts we have now 27
        $unwind: '$startDates', //$unwind => disconstract the array fields from the input documnets and then output one documnet for each elemnt of the array
      },
      {
        $match: {
          //we want to be between 2020 - 2022
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`), // we want it to be between the first day in the year and the last the day of the year
            //less ten..
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' }, //$month =>extract the month out of our date, we have in mongoose documantation a"ton" of this type of pipe line oparetors
          numTourStarts: { $sum: 1 }, //to count the number of tours
          tours: { $push: '$name' }, //$push --> will make us an array and push to this array...
        },
      },
      {
        //addFields => just like his name , making us a new fields
        $addFields: { month: '$_id' }, // add the vlue of the name _id , so in this case _id have the month value
      },
      {
        //$project --> an stage that set the value of the current thing we want to display if it current to 0 => it will not longer show up if we definf the project as 1 -> it will project
        $project: {
          _id: 0, //0-> not showed up , 1 -> showing up
        },
      },
      {
        //we hade 1 before so 1 is for asending and -1 is for de-sending
        $sort: { numTourStarts: -1 }, // we want it to sort with the hight number of tours to the lowest -> so we  will do if we want to display the deposite of that we will basiclt change it to 1
        //inside the route call we could see that in month number 7 we having the most tours
      },
      {
        $limit: 12, //limting us to only 12 outpots
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};
