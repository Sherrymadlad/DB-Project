const { sql, poolPromise } = require('../config/db');

const CuisineModel = {
  addCuisine: async (name, description) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('Name', sql.NVarChar(50), name)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .execute('AddCuisine');

      return { message: 'Cuisine added successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateCuisine: async (cuisineId, name, description) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('CuisineID', sql.Int, cuisineId)
        .input('Name', sql.NVarChar(50), name)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .execute('UpdateCuisine');

      return { message: 'Cuisine updated successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteCuisine: async (cuisineId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('CuisineID', sql.Int, cuisineId)
        .execute('DeleteCuisine');

      return { message: 'Cuisine deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllCuisines: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query('SELECT CuisineID, Name, Description FROM Cuisines');

      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getPopularCuisines: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query(`
          SELECT c.CuisineID, c.Name, COUNT(upc.UserID) AS PreferenceCount
          FROM Cuisines c
          JOIN UserPrefCuisines upc ON c.CuisineID = upc.CuisineID
          GROUP BY c.CuisineID, c.Name
          ORDER BY PreferenceCount DESC;
        `);

      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = CuisineModel;
