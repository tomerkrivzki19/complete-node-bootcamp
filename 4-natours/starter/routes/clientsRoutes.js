const express = require('express');
const clientControllers = require('../controllers/clientControllers');

const router = express.Router();
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
