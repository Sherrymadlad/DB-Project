const UserModel = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const response = await UserModel.getUsers();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { userId, name, username, password, email, phoneNum, role } = req.body;
    const response = await UserModel.createUser(userId, name, username, password, email, phoneNum, role);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const response = await UserModel.deleteUser(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, username, email, phoneNum } = req.body; 
    const response = await UserModel.updateUser(req.params.id, name, username, email, phoneNum);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.authenticateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await UserModel.authenticateUser(username, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const result = await UserModel.changePassword(userId, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const result = await UserModel.getUserReservations(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const result = await UserModel.getUserReviews(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRestaurants = async (req, res) => {
  try {
    const result = await UserModel.getMyRestaurants(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
