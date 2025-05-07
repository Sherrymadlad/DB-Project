const { sql, poolPromise } = require('../config/db');

module.exports = {
  // Get reviews by restaurant
  getReviewsByRestaurant: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('Restaurantid', sql.Int, restaurantId)
        .query('SELECT * FROM Reviews WHERE RestaurantID = @Restaurantid');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get reviews by user
  getReviewsByUser: async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('Userid', sql.Int, userId)
        .query('SELECT * FROM Reviews WHERE UserID = @Userid');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Add new review
  addReview: async (userId, restaurantId, rating, comment) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('UserID', sql.Int, userId)
        .input('RestaurantID', sql.Int, restaurantId)
        .input('Rating', sql.Int, rating)
        .input('Comment', sql.NVarChar(sql.MAX), comment)
        .execute('InsertReview');
      return { message: 'Review added successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get review count for restaurant
  getReviewCount: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .execute('CountReviewsForRestaurant');
      return result.recordset[0].TotalReviews;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get average rating for restaurant
  getAverageRating: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .query(`
          SELECT RestaurantID, AVG(CAST(Rating AS FLOAT)) AS AverageRating
          FROM Reviews
          WHERE RestaurantID = @RestaurantID
          GROUP BY RestaurantID
        `);
      return result.recordset[0]?.AverageRating || 0;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete review
  deleteReview: async (reviewId, userId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('ReviewID', sql.Int, reviewId)
        .input('UserID', sql.Int, userId)
        .execute('DeleteReview');
      return { message: 'Review deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get top rated restaurants
  getTopRatedRestaurants: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query(`
          SELECT r.RestaurantID, r.Name, AVG(rev.Rating) AS AverageRating
          FROM Restaurants r
          JOIN Reviews rev ON r.RestaurantID = rev.RestaurantID
          GROUP BY r.RestaurantID, r.Name
          ORDER BY AverageRating DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get top rated by cuisine
  getTopRatedByCuisine: async (cuisineName) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('CuisineName', sql.NVarChar(50), cuisineName)
        .query(`
          SELECT r.RestaurantID, r.Name, AVG(rv.Rating) AS AvgRating
          FROM Restaurants r
          JOIN Reviews rv ON r.RestaurantID = rv.RestaurantID
          JOIN RestCuisines rc ON r.RestaurantID = rc.RestaurantID
          JOIN Cuisines c ON rc.CuisineID = c.CuisineID
          WHERE c.Name = @CuisineName
          GROUP BY r.RestaurantID, r.Name
          ORDER BY AvgRating DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Sort user reviews
  sortUserReviews: async (userId, sortOrder) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .input('SortOrder', sql.NVarChar(10), sortOrder)
        .execute('SortUserReviewsByRating');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Sort restaurant reviews
  sortRestaurantReviews: async (restaurantId, sortOrder) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('RestaurantID', sql.Int, restaurantId)
        .input('SortOrder', sql.NVarChar(10), sortOrder)
        .execute('SortRestaurantReviewsByRating');
      return result.recordset;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};