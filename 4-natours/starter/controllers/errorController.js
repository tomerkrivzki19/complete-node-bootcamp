//err handaling middleware
module.exports = (err, req, res, next) => {
  //when there are 4 arguments exprees will regonize it as a err handaler middleware

  console.log(err.stack); //will basiclly show us where the err happend

  err.statusCode = err.statusCode || 500; //we defind that the err.statusCode the standart to is the err status code and if there not an err code connected the default will be 500-that means err from the server side
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    err: err.message,
  });
};
