const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //                 Tour.findOne({_id : req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }

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
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    console.log(newTour);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent!',
    });
  }

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
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }

  // if (req.params.id * 1 > toursFile.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'something went wrong',
  //     //this message is also a security mesaage that no to give ant inforamtion to hackers that tring to collect inforamtion about my client for examaple
  //   });
  // }
};
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

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
