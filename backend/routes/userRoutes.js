const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../config/multerConfig'); 

// Basic CRUD
router.get('/users', userController.getUsers);
router.post('/users', upload.single('profilePic'), userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', upload.single('profilePic'), userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Authentication
router.post('/users/authenticate', userController.authenticateUser);
router.post('/users/change-password', userController.changePassword);

// User-specific data
router.get('/users/:id/reservations', userController.getUserReservations);
router.get('/users/:id/reviews', userController.getUserReviews);
router.get('/users/:id/restaurants', userController.getMyRestaurants);
router.get('/users/:id/get-Res',userController.getStaffRestaurant);

module.exports = router;
