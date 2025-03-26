const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Add a new restaurant
router.post('/restaurants', restaurantController.addRestaurant);

// Get all restaurants
router.get('/restaurants', restaurantController.getAllRestaurants);

// Get a restaurant by ID
router.get('/restaurants/:id', restaurantController.getRestaurantById);

// Update restaurant details
router.put('/restaurants/:id', restaurantController.updateRestaurant);

// Delete a restaurant
router.delete('/restaurants/:id', restaurantController.deleteRestaurant);

module.exports = router;
