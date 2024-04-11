const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllClients = async (req, res) => {
  try {
    const Users = await User.find();

    res.status(200).json({
      status: 'success',
      results: Users.length,
      data: {
        Users,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.createClient = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
exports.getClient = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
exports.updateClient = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'faild',
    message: 'something went wrong',
  });
};
