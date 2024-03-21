const AppError = require('../utils/appError');

//ERR HANDALING MIDDLEWARE
const handleCastErrorDB = (err) => {
  console.log('handleCastErrorDB function activated');
  //path | value --> the name of the field that was typed in the wrong format- we got that also from postman by typing wrong details
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational,trusted error : send message to the client
  if (err.isOperational) {
    // err.isOperational -> the proparty that we set to true inside of the error class that we created
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programing or other unknown error: don't leak error details
  } else {
    //1)Log error
    console.log('ERROR 💣', err);

    // 2)Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  //when there are 4 arguments exprees will regonize it as a err handaler middleware

  // console.log(err.stack); //will basiclly show us where the err happend
  // console.log(process.env.NODE_ENV);
  console.log(err);
  err.statusCode = err.statusCode || 500; //we defind that the err.statusCode the standart to is the err status code and if there not an err code connected the default will be 500-that means err from the server side
  err.status = err.status || 'error';

  //we sending the same error responses to everyone , the idea in production we want to leak as little information as possible of our error to our clients with nice human messages,
  //in the other hand in on development we want to get as mutch inforamtion as possible, we could print it in the conslole , but we could also send the err deatils to postman
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //the error.name dont work becouse in some reason the err that passed to error veribale do not geting the name verible from the error!
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    //if(message.name === 'CastError') --> this is the err that the client geting in some cases , we got the path to the error from postman by simply wroting wrong / false details
    //console.log('error name:', err.name); //for testig !

    sendErrorProd(error, res);
  }
};
