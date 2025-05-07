const express = require('express');
const router = express.Router();
const userPreferenceController = require('../controllers/userPreferenceController');

// Cuisine preferences
router.get('/users/:id/cuisine-preferences', userPreferenceController.getCuisinePreferences);
router.post('/users-cuisine-preferences', userPreferenceController.addCuisinePreference);
router.delete('/users/:id/cuisine-preferences', userPreferenceController.removeCuisinePreference);

// Restaurant preferences
router.get('/users/:id/restaurant-preferences', userPreferenceController.getRestaurantPreferences);
router.post('/users-restaurant-preferences', userPreferenceController.addRestaurantPreference);
router.delete('/users/:id/restaurant-preferences', userPreferenceController.removeRestaurantPreference);

module.exports = router;
