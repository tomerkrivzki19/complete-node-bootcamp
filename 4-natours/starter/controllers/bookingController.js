const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //this require will usually exports an function here , then we can simpaly pass our secret key right into that , and that will then give us an stripe object that we can work with

const sharp = require('sharp');
const multer = require('multer');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    //1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId); //the name we gave it ay the url paramater
    //2) Create checkout session
    //*) information about the session itself: | create => we need to await becouse the create is returning a promise becouse its sending an API call (with all the settings)  to stripe , this is for why its a async function that we need to wait
    // const session = await stripe.checkout.session.create({
    //   payment_methods_types: ['card'], // the payment methods we want to use
    //   success_url: `${req.protocol}://${req.get('host')}/`, //the url that wil be called right away when the purchest is succesfull
    //   current_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, //the page that the user goes if they decided to cancell the payment| {tour.slug} => the tour that was selected previously
    //   customer_email: req.user.email, //we have access to the customers email and so with this we can save the user one step and make the checkout experince mutch smooter| req.user.email => this is a safe route meaning that the user have already detaills in the req
    //   client_reference_id: req.params.tourID, //allow us information about the session that have been created , this will help us to prepare to the next step (use strip webhook to create a new booking ) this one is only works for deployed wesites | req.params.tourId => we need the tour id so for that we taking that from the params (url)
    //   //*)  al the information about the product that the user is about to purchest
    //   line_items: [
    //     {
    //       name: `${tour.name} Tour`,
    //       description: tour.summary,
    //       images: [], //live images we need to get from an actual server
    //       ammout: tour.price * 100, //the price of the product , we have to multiply the product bcouse the ammount is expected in sents
    //       currency: 'usd', //it can only be euro and more that onlt supported by stripe
    //       quantity: 1, //one tour in this case
    //     },
    //   ],
    // });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourID,
      line_items: [
        {
          price_data: {
            unit_amount: tour.price * 100,
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
              description: tour.summary,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
    //3) Create session as response
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (error) {
    next(error);
  }
};
