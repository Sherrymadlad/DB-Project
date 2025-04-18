const RestaurantModel = require('../models/restaurantModel');
const { validationResult } = require('express-validator');

const RestaurantController = {
  // Get all restaurants
  getRestaurants: async (req, res) => {
    try {
      const response = await RestaurantModel.getRestaurants();
      if (!response.success) {
        return res.status(404).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Restaurants fetched successfully', data: response.data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching restaurants', error: error.message });
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (req, res) => {
    const { id } = req.params;
    try {
      const response = await RestaurantModel.getRestaurantById(id);
      if (!response.success) {
        return res.status(404).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Restaurant fetched successfully', data: response.data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching restaurant by ID', error: error.message });
    }
  },

  // Register a new restaurant
  registerRestaurant: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    }

    try {
      const response = await RestaurantModel.registerRestaurant(req.body);
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(201).json({ success: true, message: 'Restaurant registered successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error registering restaurant', error: error.message });
    }
  },

  // Update an existing restaurant
  updateRestaurant: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    }

    try {
      const response = await RestaurantModel.updateRestaurant(req.body);
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Restaurant updated successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error updating restaurant', error: error.message });
    }
  },

  // Delete a restaurant
  deleteRestaurant: async (req, res) => {
    const RestaurantID = parseInt(req.params.id);
    const { UserID } = req.body; // Or from req.user.id if using auth middleware
  
    if (!UserID || isNaN(RestaurantID)) {
      return res.status(400).json({ success: false, message: 'UserID and valid RestaurantID are required' });
    }
  
    try {
      const response = await RestaurantModel.deleteRestaurant(UserID, RestaurantID);
      return res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error deleting restaurant', error: error.message });
    }
  },

  // Search for restaurants with filters
  searchRestaurants: async (req, res) => {
    const { userId, searchTerm, filterBy, location, sortBy } = req.body;
    try {
      const response = await RestaurantModel.searchRestaurants({ userId, searchTerm, filterBy, location, sortBy });
      if (!response.success) {
        return res.status(404).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Restaurants fetched successfully', data: response.data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching searched restaurants', error: error.message });
    }
  },

  // Assign an admin to a restaurant
  assignAdmin: async (req, res) => {
    const { UserID, TargetUserID } = req.body;
    const RestaurantID = parseInt(req.params.id);
    try {
      const response = await RestaurantModel.assignAdmin({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Admin assigned successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error assigning admin', error: error.message });
    }
  },

  // Remove an admin from a restaurant
  removeAdmin: async (req, res) => {
    const { UserID, TargetUserID } = req.body;
    const RestaurantID = parseInt(req.params.id);
    try {
      const response = await RestaurantModel.removeAdmin({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Admin removed successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error removing admin', error: error.message });
    }
  },

  // Assign staff to a restaurant
  assignStaff: async (req, res) => {
    const { UserID, TargetUserID } = req.body;
    const RestaurantID = parseInt(req.params.id);

    if (!UserID || !TargetUserID || isNaN(RestaurantID)) {
      return res.status(400).json({ success: false, message: 'UserID, TargetUserID, and valid RestaurantID are required' });
    }

    try {
      const response = await RestaurantModel.assignStaff({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Staff assigned successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error assigning staff', error: error.message });
    }
  },

  // Remove staff from a restaurant
  removeStaff: async (req, res) => {
    const { UserID, TargetUserID } = req.body;
    const RestaurantID = parseInt(req.params.id);

    if (!UserID || !TargetUserID || isNaN(RestaurantID)) {
      return res.status(400).json({ success: false, message: 'UserID, TargetUserID, and valid RestaurantID are required' });
    }

    try {
      const response = await RestaurantModel.removeStaff({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Staff removed successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error removing staff', error: error.message });
    }
  },

  // Add an image to a restaurant
  addImage: async (req, res) => {
    const { UserID } = req.body;
    const RestaurantID = parseInt(req.params.id);
    const Image = req.file ? req.file.buffer : null; // Assuming you're using `multer` for image upload

    if (!Image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    try {
      const response = await RestaurantModel.addImage({ RestaurantID, Image, UserID });
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Image added successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error adding image', error: error.message });
    }
  },

  // Delete an image from a restaurant
  deleteImage: async (req, res) => {
    const { ImageID, UserID } = req.body;
    const RestaurantID = parseInt(req.params.id);
    try {
      const response = await RestaurantModel.deleteImage({ RestaurantID, ImageID, UserID });
      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error deleting image', error: error.message });
    }
  },

  // Get restaurant admins
  getRestaurantAdmins: async (req, res) => {
    const RestaurantID = req.params.id;
    try {
      const response = await RestaurantModel.getRestaurantAdmins(RestaurantID);
      if (!response.success) {
        return res.status(404).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Restaurant admins fetched successfully', data: response.data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching restaurant admins', error: error.message });
    }
  },

  // Get restaurant staff
  getRestaurantStaff: async (req, res) => {
    const RestaurantID = req.params.id;
    try {
      const response = await RestaurantModel.getRestaurantStaff(RestaurantID);
      if (!response.success) {
        return res.status(404).json({ success: false, message: response.message });
      }
      return res.status(200).json({ success: true, message: 'Restaurant staff fetched successfully', data: response.data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching restaurant staff', error: error.message });
    }
  },

  // Get images for a restaurant
  getRestaurantImages: async (req, res) => {
    const { RestaurantID } = req.params;
    try {
      const images = await RestaurantModel.getRestaurantImages(RestaurantID);
      return res.status(200).json({
        success: true,
        message: 'Images fetched successfully',
        data: images || [] // Ensure empty list is returned even if undefined
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching restaurant images',
        error: error.message
      });
    }
  },

  // Set restaurant status
  setRestaurantStatus: async (req, res) => {
    const { restaurantId, status } = req.body;
    try {
      const response = await RestaurantModel.setRestaurantStatus({ restaurantId, status });

      if (!response.success) {
        return res.status(400).json({ success: false, message: response.message });
      }

      return res.status(200).json({ success: true, message: response.message });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
    }
  }
};

module.exports = RestaurantController;