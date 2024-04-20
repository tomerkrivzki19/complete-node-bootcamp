const express = require('express');
const clientControllers = require('../controllers/clientControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/singup', authController.singup);
router.post('/login', authController.login);

//user friendly forget password functionality
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//we doing patch becouse we manipulatiog the user document
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

///api/v1/users
router
  .route('/')
  .get(clientControllers.getAllClients)
  .post(clientControllers.createClient);
router
  .route('/:id')
  .get(clientControllers.getClient)
  .patch(clientControllers.updateClient)
  .delete(clientControllers.deleteUser);

module.exports = router;
