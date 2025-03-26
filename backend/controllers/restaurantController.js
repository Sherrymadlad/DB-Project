const RestaurantModel = require('../models/restaurantModel');

// Add a restaurant
exports.addRestaurant = async (req, res) => {
    try {
        const result = await RestaurantModel.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantModel.getAll();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await RestaurantModel.getById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const result = await RestaurantModel.update(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const result = await RestaurantModel.delete(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
