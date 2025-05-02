const CuisineModel = require('../models/cuisineModel');

module.exports = {
  addCuisine: async (req, res) => {
    const { name, description } = req.body;
    try {
      const data = await CuisineModel.addCuisine(name, description);
      res.status(201).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add cuisine', error: error.message });
    }
  },

  updateCuisine: async (req, res) => {
    const { cuisineId, name, description } = req.body;
    try {
      const data = await CuisineModel.updateCuisine(cuisineId, name, description);
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update cuisine', error: error.message });
    }
  },

  deleteCuisine: async (req, res) => {
    const { cuisineId } = req.body;
    try {
      const data = await CuisineModel.deleteCuisine(cuisineId);
      res.status(200).json({ success: true, message: data.message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete cuisine', error: error.message });
    }
  },

  getAllCuisines: async (req, res) => {
    try {
      const data = await CuisineModel.getAllCuisines();
      if (!data.length)
        return res.status(404).json({ success: false, message: 'No cuisines found' });

      res.status(200).json({ success: true, message: 'Cuisines retrieved', data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving cuisines', error: error.message });
    }
  },

  getPopularCuisines: async (req, res) => {
    try {
      const data = await CuisineModel.getPopularCuisines();
      res.status(200).json({ success: true, message: 'Popular cuisines retrieved', data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving popular cuisines', error: error.message });
    }
  }
};
