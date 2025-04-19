const express = require('express');
const router = express.Router();
const cuisineController = require('../controllers/cuisineController');

// Cuisine operations
router.post('/cuisines', cuisineController.addCuisine);
router.put('/cuisines', cuisineController.updateCuisine);
router.delete('/cuisines', cuisineController.deleteCuisine);

// Retrieve cuisines
router.get('/cuisines', cuisineController.getAllCuisines);
router.get('/cuisines/popular', cuisineController.getPopularCuisines);

module.exports = router;
