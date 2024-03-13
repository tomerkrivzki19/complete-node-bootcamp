const express = require('express');
const morgan = require('morgan');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/clientsRoutes');
// exapale of middaleeare:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(express.static('./public'));
// app.use((req, res, next) => { // exampe of middaleware
//   console.log('Hello from the middleware function 👋');
//   next();
// });
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

//TOUTE HANDALERS

// a way to make the code look more arragend;

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
// a shorter way to make the code look more arragend

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  //handle all the urls for untyped correctly urls -- err handaling for mispale paths in node.js
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find  ${req.originalUrl} on this server`, //originalUrl--> as the names says this will bring us the url that was reqested
  // });
  //WE BASICLY BUILD A CONSTRUCTOR TO DEAL WITH ALL OF THIS FUNCTION BY BUILDING A NEW ERR WILL CLASS AND CONSTRUCTOR
  // in a way that we want to defind our own err
  // const err = new Error(`can't find  ${req.originalUrl} on this server`); //Error - abuild in err constractur , that inside him we defind an err string that will be displayed inside of the err message
  // err.status = 'fail';
  // err.statusCode = 404;
  //we creating an err and then we defind the status  and the statusCode proparties on it so that our err handaling middaleware can use them on the next step
  //  next(err); //if the next function reciving an argument not metter what will happen the express wil read it as an err -> so what it will do is to skip all the pther middlewers and send an err that we paseed in to the global err handaling middleware that will executed

  //THE USE OF A CONSTRUCTOR
  next(new AppError(`can't find  ${req.originalUrl} on this server`, 404));
});

//all --> for all the urls // * ==> means for all simiilar in react-router

//err handaling middleware
app.use(globalErrorHandler);

//START THE SERVER

module.exports = app;
