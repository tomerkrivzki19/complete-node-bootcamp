const fs = require('fs');
const Tour = require('../models/tourModel');

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

// **** To make our code more arrange we can to make a callback function out side the request's and that will make to use more understand the code more then when the callbacks function are inside the reqeust's.
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    // console.log(req.requestTime);
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
