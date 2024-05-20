const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

//TESTING :

// router.get('/', (req, res) => {
//   res.setHeader('Origin-Agent-Cluster', 'require=origin');

//   //render() -> will render the name that we passed in
//   res.status(200).render('base', {
//     //in order to pass data to the tamplate here , we need to open an opject option and from there we can pass data ,this data will be availble in the pug tamplate
//     tour: 'The Forest Hiker',
//     user: 'Jonas',
//     //this veribales that we pass in here called locals in the pug filles
//   });
// });

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

// create a /login route => controller => tamplate - (the tamplate located at the tamplate folder named login tamplate )
router.get('/login',viewController.getLoginForm)

module.exports = router;
