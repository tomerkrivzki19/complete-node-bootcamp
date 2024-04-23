const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // for securing https headers
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/clientsRoutes');

// Global middaleeares:
//set Security HTTP headers
app.use(helmet()); // need to put in the begining becouse this will secure hour headers

//Development log-in
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// console.log(process.env.NODE_ENV);

//Limit requests from same API
//rateLimiter package is an package that block hackers trying shut our server down by sending multiply of requsts by definding how mutch request ther server should talke before dening them
const limiter = rateLimit({
  max: 100, // 100 request
  windowMs: 60 * 60 * 1000, //for 1 hour
  //result : 100 req from that one ip in one hour, when that surten of ip get above 100 req in an hour he will get an err
  message: 'Too many request from this IP, please try again in an hour !',
});

// this middlewate only affect on routes that contain '/api' route
app.use('/api', limiter);
//TODO: ! PAY ATTENTION - THIS CURRENT LIMITER FUNTION MIDDLE WARE IS AVAIBLE FOR ALL THE REQ NOT ONLT FOR THE LOGIN , MEANING WE LINITING our clients in sorten way

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); //here we set the limit for parsering files to max of 10 kb , what will happeend id there are a file more then 10 kb , simpily he will not be accepted

//Data sanitization against NoSQL query injection
// A HACKER METHOD - FIXME:CRAZY - login without knew the email
// on login:
// {
//   "EMAIL":{"$gt": "" }
// "PASSWORD": pass12356
// }

//This methods here will access us as admin to the site, to aviod that we need to implement:
app.use(mongoSanitize()); // this is a function that we call that them will return us a middleware function that then we can use, what the middleware function does is to loook at the req body, req queryString and also req.params and filter out all the dollars sign and dots, y removing them this apparators will no longer work

//Data sanitization against XSS
app.use(xss()); //clean any user input from malicious html code . prevent attacker to put inside inputs some html code that could hack the system, by this middleware we preventing that by converting all the html simbels

//Prevent paramater pollution - clear up the duplicate query string , for example if we have on the url : ?sort=duration&sort=price ==> this will give us an array of two paramters of sort and fisplay eventually an err, this package is preventing that to happen by sorting the last one that has been typed
app.use(
  //there are some proparties that we actuallt want the duplicate to work , like duration : we want to query proprates wiht duration 5 and 10 for exmaple , so to activate that we can use inside the options the whitelist option, and there get acces to those stuff
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ], //simply array of proparties that we actually aloow to duplicate
  })
); // to prevent

//Serving static files
app.use(express.static('./public'));
// app.use((req, res, next) => { // exampe of middaleware
//   console.log('Hello from the middleware function 👋');
//   next();
// });

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers); //access to the req headers
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
