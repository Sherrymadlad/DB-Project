const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Basic review operations
router.get('/restaurant/:restaurantId', reviewController.getByRestaurant);
router.get('/reviews-user/:userId', reviewController.getByUser);
router.post('/review', reviewController.addReview);
router.delete('/:reviewId', reviewController.deleteReview);

// Statistics
router.get('/stats/:restaurantId', reviewController.getStats);

// Top rated
router.get('/top-rated', reviewController.getTopRated);

// Sorting
router.get('/sort/:type/:id', reviewController.sortReviews);

module.exports = router;