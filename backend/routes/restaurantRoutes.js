const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Basic CRUD
router.get('/restaurants', restaurantController.getRestaurants);
router.post('/restaurants', restaurantController.registerRestaurant);
router.get('/restaurants/:id', restaurantController.getRestaurantById);
router.put('/restaurants/:id', restaurantController.updateRestaurant);
router.delete('/restaurants/:id', restaurantController.deleteRestaurant);

// Restaurant-specific data
router.get('/restaurants/:id/admins', restaurantController.getRestaurantAdmins);
router.get('/restaurants/:id/staff', restaurantController.getRestaurantStaff);
router.get('/restaurants/:id/images', restaurantController.getRestaurantImages);

// Managing restaurant roles
router.post('/restaurants/:id/assign-admin', restaurantController.assignAdmin);
router.post('/restaurants/:id/remove-admin', restaurantController.removeAdmin);
router.post('/restaurants/:id/assign-staff', restaurantController.assignStaff);
router.post('/restaurants/:id/remove-staff', restaurantController.removeStaff);

// Image management for restaurants
router.post('/restaurants/:id/add-image', restaurantController.addImage);
router.delete('/restaurants/:id/delete-image', restaurantController.deleteImage);

// Get restaurants by status or cuisine
router.get('/restaurants/status/:status', restaurantController.getRestaurantsByStatus);
router.get('/restaurants/cuisine/:cuisineId', restaurantController.getRestaurantsByCuisine);

module.exports = router;
