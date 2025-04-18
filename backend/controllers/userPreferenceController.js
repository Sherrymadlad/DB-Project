const UserPreferenceModel = require('../models/userPreferenceModel');

exports.getCuisinePreferences = async (req, res) => {
  try {
    const result = await UserPreferenceModel.getCuisinePreferences(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCuisinePreference = async (req, res) => {
  try {
    const { userId, cuisineId } = req.body;
    const result = await UserPreferenceModel.addCuisinePreference(userId, cuisineId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeCuisinePreference = async (req, res) => {
  try {
    const userId = req.params.id;
    const { cuisineId } = req.body;
    const result = await UserPreferenceModel.removeCuisinePreference(userId, cuisineId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRestaurantPreferences = async (req, res) => {
  try {
    const result = await UserPreferenceModel.getRestaurantPreferences(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRestaurantPreference = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;
    const result = await UserPreferenceModel.addRestaurantPreference(userId, restaurantId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeRestaurantPreference = async (req, res) => {
  try {
    const userId = req.params.id;
    const { restaurantId } = req.body;
    const result = await UserPreferenceModel.removeRestaurantPreference(userId, restaurantId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
