const express = require('express');
const tourControllers = require('../controllers/tourControllers');
// a shorter way to make the code look more arragend
const router = express.Router();

// api/v1/tours'
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
