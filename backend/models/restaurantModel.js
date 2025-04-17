const { sql, poolPromise } = require('../config/db');

const RestaurantModel = {
  //Get all restaurants
  getRestaurants: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query(`
            Select * from Restaurants
        `);

        return result.recordset;
    } catch (error){
      throw new Error(error.message);
    }
  },

  //Get resaurants by their id
  getResaurantById: async (id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("RestaurantID", sql.Int, id)
            .query(`
                SELECT * FROM Restaurants
                WHERE RestaurantID = @RestaurantID
            `);

        return result.recordset[0] || null;
    } catch (error) {
        throw new Error(error.message);
    }
  }
};

module.exports = RestaurantModel;
