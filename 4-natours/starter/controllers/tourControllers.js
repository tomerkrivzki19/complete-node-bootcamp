const fs = require('fs');

const toursFile = JSON.parse(
  fs.readFileSync('../starter/dev-data/data/tours-simple.json')
);

// **** To make our code more arrange we can to make a callback function out side the request's and that will make to use more understand the code more then when the callbacks function are inside the reqeust's.
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    reqestedAt: req.requestTime,
    results: toursFile.length,
    data: {
      tours: toursFile,
    },
  });
};
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // we done this becouse on the params output we have the outpot as a string , so on this js trick we converting the string to a number

  const tour = toursFile.find((el) => el.id === id);

  // if there are not sutch as existing id , then we need to make sure that the client not gets a 200 status code and also make sure that there is the right message for the client side

  //first solution --
  // if (id > toursFile.length) {
  //seconed solution -- is more speesific to our case
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'somthing went wrong',
      //this message is also a sequrity mesaage that no to give ant inforamtion to hackers that tring to collect inforamtion about my client for examaple
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = toursFile[toursFile.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursFile.push(newTour);

  fs.writeFile(
    '../starter/dev-data/data/tours-simple.json',
    JSON.stringify(toursFile),
    (err) => {
      res.status(201).send({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );

  // res.send('done!');
};
exports.updateTour = (req, res) => {
  if (req.params.id * 1 > toursFile.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'something went wrong',
      //this message is also a security mesaage that no to give ant inforamtion to hackers that tring to collect inforamtion about my client for examaple
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<write your update here....>',
    },
  });
};
exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > toursFile.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'something went wrong',
      //this message is also a security mesaage that no to give ant inforamtion to hackers that tring to collect inforamtion about my client for examaple
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
