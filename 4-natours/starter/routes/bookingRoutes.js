const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

//this route is not about geting or updating ,creating any bookings , its also will not follow the rest of the end-points ,instead  this route will be only for the client get a ceckout session
router.get(
  '/checkout-session/:tourId', // we want the client to send the id of hte tour that beain book , thats for that we could fill up the scheckout session with  all the data that is nesesary ; such as a tour name ,tour price etc...
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
