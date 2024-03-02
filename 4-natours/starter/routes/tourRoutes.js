const express = require('express');
const tourControllers = require('../controllers/tourControllers');
// we could also make a shortcut by destractaring the callbacks when importing them from exports
// const {getAllTours,createTour,getTour, updateTour, deleteTour } = require('../controllers/tourControllers');
// this will short us when we applyig the callback to the route.

// a shorter way to make the code look more arragend
const router = express.Router();

//middleWare indise the route
//*id there is no param the code will ignore that middale wahre and move on
// router.param('id', tourControllers.checkId);

// api/v1/tours'
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);
// tourControllers.checkBody -- > exmaple of middleware
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
