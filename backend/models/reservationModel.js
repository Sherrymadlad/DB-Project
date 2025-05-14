const { sql, poolPromise } = require('../config/db');

const ReservationModel = {
  // Add a reservation
  addReservation: async (userId, tableId, time, duration, people, request) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .input('TableID', sql.Int, tableId)
        .input('Time', sql.DateTime, time)
        .input('Duration', sql.Int, duration)
        .input('People', sql.Int, people)
        .input('Request', sql.NVarChar(sql.MAX), request)
        .execute('AddReservation');
      return { message: 'Reservation added successfully', data: result.recordset[0].ReservationID };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Modify a reservation
  modifyReservation: async (reservationId, userId, newTime, newDuration, newPeople, newRequest) => {
    try {
      const pool = await poolPromise;
      const request = pool.request()
        .input('ReservationID', sql.Int, reservationId)
        .input('UserID', sql.Int, userId);

      if (newTime) request.input('NewTime', sql.DateTime, newTime);
      if (newDuration) request.input('NewDuration', sql.Int, newDuration);
      if (newPeople) request.input('NewPeople', sql.Int, newPeople);
      if (newRequest) request.input('NewRequest', sql.NVarChar(sql.MAX), newRequest);

      await request.execute('ModifyReservation');

      return { message: 'Reservation modified successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Cancel a reservation
  cancelReservation: async (reservationId, userId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('ReservationID', sql.Int, reservationId)
        .input('UserID', sql.Int, userId)
        .execute('CancelReservation');

      return { message: 'Reservation cancelled successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Approve a reservation
  approveReservation: async (reservationId, userId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('ReservationID', sql.Int, reservationId)
        .input('UserID', sql.Int, userId)
        .execute('ApproveReservation');

      return { message: 'Reservation approved successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Complete a reservation
  completeReservation: async (reservationId, userId) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('ReservationID', sql.Int, reservationId)
        .input('UserID', sql.Int, userId)
        .execute('CompleteReservation');

      return { message: 'Reservation completed successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // View reservations for a user
  viewReservationsUser: async (userId, status = null) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('UserID', sql.Int, userId);

      // Input for Status (only if provided)
      if (status) {
        request.input('Statuses', sql.NVarChar(sql.MAX), status);
      }

      const result = await request.execute('ViewReservationsUser');
      return result.recordset; 
    } catch (error) {
      throw new Error(error.message);
    }
  },

    // View reservations for a specific restaurant
  viewReservationsRestaurant: async (restaurantId, status = null) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('RestaurantID', sql.Int, restaurantId);

      // Input for Status (only if provided)
      if (status) {
        request.input('Status', sql.NVarChar(sql.MAX), status);
      }

      const result = await request.execute('ViewReservationsRestaurant');
      return result.recordset; 
    } catch (error) {
      throw new Error(error.message);
    }
  },

    // View reservations for a user
  viewReservationsToday: async (restaurantId) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      request.input('RestaurantID', sql.Int, restaurantId);

      const result = await request.execute('GetTodayApprovedReservations');
      return result.recordset; 
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Process reservation payment
  processPayment: async (reservationId, amount, method) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('ReservationID', sql.Int, reservationId)
        .input('Amount', sql.Int, amount)
        .input('Method', sql.NVarChar(10), method)
        .execute('ProcessReservationPayment');

      return { message: 'Payment processed successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = ReservationModel;
