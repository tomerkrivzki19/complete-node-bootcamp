const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

// exapale of middaleeare:
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware function 👋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// TODO:
// example of reqest:
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to do this endpoint ....');
// });

const toursFile = JSON.parse(
  fs.readFileSync('../starter/dev-data/data/tours-simple.json')
);

//TOUTE HANDALERS
// **** To make our code more arrange we can to make a callback function out side the request's and that will make to use more understand the code more then when the callbacks function are inside the reqeust's.
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
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
const createTour = (req, res) => {
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
const updateTour = (req, res) => {
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
const deleteTour = (req, res) => {
  if (req.params.id * 1 > toursFile4.length) {
    return res.status(04).json({
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

// a way to make the code look more arragend;

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
// a shorter way to make the code look more arragend
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//START THE SERVER
const port = 4000;
app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});
