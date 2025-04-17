const RestaurantModel = require('../models/restaurantModel');

const RestaurantController = {
  // Get all restaurants
  getRestaurants: async (req, res) => {
    try {
      const response = await RestaurantModel.getRestaurants();
      if (!response.success) {
        return res.status(404).json({ message: response.message });
      }
      return res.status(200).json({ data: response.data });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (req, res) => {
    const { id } = req.params;
    try {
      const response = await RestaurantModel.getRestaurantById(id);
      if (!response.success) {
        return res.status(404).json({ message: response.message });
      }
      return res.status(200).json({ data: response.data });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching restaurant by ID', error: error.message });
    }
  },

  // Register a new restaurant
  registerRestaurant: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await RestaurantModel.registerRestaurant(req.body);
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(201).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error registering restaurant', error: error.message });
    }
  },

  // Update an existing restaurant
  updateRestaurant: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await RestaurantModel.updateRestaurant(req.body);
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating restaurant', error: error.message });
    }
  },

  // Delete a restaurant
  deleteRestaurant: async (req, res) => {
    const { UserID, RestaurantID } = req.body;

    try {
      const response = await RestaurantModel.deleteRestaurant(UserID, RestaurantID);
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
    }
  },

  // Get restaurants by status
  getRestaurantsByStatus: async (req, res) => {
    const { status } = req.params;
    try {
      const response = await RestaurantModel.getRestaurantsByStatus(status);
      if (!response.success) {
        return res.status(404).json({ message: response.message });
      }
      return res.status(200).json({ data: response.data });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching restaurants by status', error: error.message });
    }
  },

  // Get restaurants by cuisine
  getRestaurantsByCuisine: async (req, res) => {
    const { cuisineId } = req.params;
    try {
      const response = await RestaurantModel.getRestaurantsByCuisine(cuisineId);
      if (!response.success) {
        return res.status(404).json({ message: response.message });
      }
      return res.status(200).json({ data: response.data });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching restaurants by cuisine', error: error.message });
    }
  },

  // Assign an admin to a restaurant
  assignAdmin: async (req, res) => {
    const { RestaurantID, UserID, TargetUserID } = req.body;
    try {
      const response = await RestaurantModel.assignAdmin({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error assigning admin', error: error.message });
    }
  },

  // Remove an admin from a restaurant
  removeAdmin: async (req, res) => {
    const { RestaurantID, UserID, TargetUserID } = req.body;
    try {
      const response = await RestaurantModel.removeAdmin({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error removing admin', error: error.message });
    }
  },

  // Assign a staff member to a restaurant
  assignStaff: async (req, res) => {
    const { RestaurantID, UserID, TargetUserID } = req.body;
    try {
      const response = await RestaurantModel.assignStaff({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error assigning staff', error: error.message });
    }
  },

  // Remove a staff member from a restaurant
  removeStaff: async (req, res) => {
    const { RestaurantID, UserID, TargetUserID } = req.body;
    try {
      const response = await RestaurantModel.removeStaff({ RestaurantID, UserID, TargetUserID });
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error removing staff', error: error.message });
    }
  },

  // Add an image to a restaurant
  addImage: async (req, res) => {
    const { RestaurantID, UserID } = req.body;
    const Image = req.file ? req.file.buffer : null; // Assuming you're using `multer` for image upload

    if (!Image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    try {
      const response = await RestaurantModel.addImage({ RestaurantID, Image, UserID });
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error adding image', error: error.message });
    }
  },

  // Delete an image from a restaurant
  deleteImage: async (req, res) => {
    const { RestaurantID, ImageID, UserID } = req.body;
    try {
      const response = await RestaurantModel.deleteImage({ RestaurantID, ImageID, UserID });
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }
      return res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
  },

  // Get restaurant admins
  getRestaurantAdmins: async (req, res) => {
    const { RestaurantID } = req.params;
    try {
      const response = await RestaurantModel.getRestaurantAdmins(RestaurantID);
      if (!response.success) {
        return res.status(404).json({ message: response.message });
      }
      return res.status(200).json({ data: response.data });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching restaurant admins', error: error.message });
    }
  },

  // Get restaurant staff
  getRestaurantStaff: async (req, res) => {
    const { RestaurantID } = req.params;
    try {
      const response = await RestaurantModel.getRestaurantStaff(RestaurantID);
      if (!response.success) {
        return res.status(404).json({ message: response.message });
      }
      return res.status(200).json({ data: response.data });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching restaurant staff', error: error.message });
    }
  },

  // Get images for a restaurant
  getRestaurantImages: async (req, res) => {
    const { id } = req.params;
    try {
      const images = await RestaurantModel.getRestaurantImages(id);
      if (images.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Images fetched successfully',
          data: images
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No images found for this restaurant'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching restaurant images',
        error: error.message
      });
    }
  }
};

module.exports = RestaurantController;
