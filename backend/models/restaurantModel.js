const { sql, poolPromise } = require('../config/db');

class RestaurantModel {
    // Add a new restaurant
    static async create({ name, description, location, phoneNum, operatingHoursStart, operatingHoursEnd, adminUserId }) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('name', sql.NVarChar, name)
                .input('description', sql.NVarChar, description)
                .input('location', sql.NVarChar, location)
                .input('phoneNum', sql.NVarChar, phoneNum)
                .input('operatingHoursStart', sql.Time, operatingHoursStart)
                .input('operatingHoursEnd', sql.Time, operatingHoursEnd)
                .input('adminUserId', sql.Int, adminUserId)
                .query(`
                    INSERT INTO Restaurants (Name, Description, Location, PhoneNum, OperatingHoursStart, OperatingHoursEnd, AdminUserID) 
                    VALUES (@name, @description, @location, @phoneNum, @operatingHoursStart, @operatingHoursEnd, @adminUserId)
                `);
            return { message: 'Restaurant added successfully' };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Get all restaurants
    static async getAll() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM Restaurants');
            return result.recordset;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Get a restaurant by ID
    static async getById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Restaurants WHERE RestaurantID = @id');

            if (result.recordset.length === 0) return null;
            return result.recordset[0];
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Update a restaurant
    static async update(id, { name, description, location, phoneNum, operatingHoursStart, operatingHoursEnd }) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('id', sql.Int, id)
                .input('name', sql.NVarChar, name)
                .input('description', sql.NVarChar, description)
                .input('location', sql.NVarChar, location)
                .input('phoneNum', sql.NVarChar, phoneNum)
                .input('operatingHoursStart', sql.Time, operatingHoursStart)
                .input('operatingHoursEnd', sql.Time, operatingHoursEnd)
                .query(`
                    UPDATE Restaurants SET 
                    Name=@name, Description=@description, Location=@location, PhoneNum=@phoneNum, 
                    OperatingHoursStart=@operatingHoursStart, OperatingHoursEnd=@operatingHoursEnd 
                    WHERE RestaurantID=@id
                `);

            return { message: 'Restaurant updated successfully' };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Delete a restaurant
    static async delete(id) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Restaurants WHERE RestaurantID = @id');

            return { message: 'Restaurant deleted successfully' };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = RestaurantModel;
