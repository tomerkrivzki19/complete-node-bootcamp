const Tour = require('../models/tourModel');

exports.getOverview = async (req, res, next) => {
  try {
    // How to present all the tours on the main page steps:
    // 1) Get tour data from collection
    const tours = await Tour.find();
    // 2) Build template --> we need to pass all the tours in to the pug page ,and how we do that?
    //we basiclly passing the tours object to the response (see in a example bellow).

    // 3) Render that tamplate using tour data from step 1

    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTour = async (req, res, next) => {
  try {
    // 1) get the data , for the requested tour (including reviews and guides)
    //the guides is already puplate in the schema ,
    // we need to pupolate the reviews also.
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    //2) Build tamplate(pug tamplate)
    //3) Render tamplate using the data from step 1
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
  } catch (error) {
    next(error);
  }
};

// login
exports.getLoginForm = async(req,res,next)=>{
  try {
    res.status(200).render('login',{
      title:'Log into you acoount'
    })
  } catch (error) {
    next(error)
  }
}