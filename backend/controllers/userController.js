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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, username, password, email, phoneNum, role } = req.body;
    const response = await UserModel.createUser(name, username, password, email, phoneNum, role);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
