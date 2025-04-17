const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Basic CRUD
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Authentication
router.post('/users/authenticate', userController.authenticateUser);
router.post('/users/change-password', userController.changePassword);

// User-specific data
router.get('/users/:id/reservations', userController.getUserReservations);
router.get('/users/:id/reviews', userController.getUserReviews);
router.get('/users/:id/restaurants', userController.getMyRestaurants);

module.exports = router;
