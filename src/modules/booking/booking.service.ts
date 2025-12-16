import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
      const { userId, vehicleId, startDate, endDate } = payload;
      const result = await pool.query(`INSERT INTO bookings (user_id, vehicle_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *`, [userId, vehicleId, startDate, endDate]);
      return result;
}

const updateBooking = async (payload: Record<string, unknown>) => {
      const { id, userId, vehicleId, startDate, endDate } = payload;
      const result = await pool.query(`UPDATE bookings SET user_id = $1, vehicle_id = $2, start_date = $3, end_date = $4 WHERE id = $5 RETURNING *`, [userId, vehicleId, startDate, endDate, id]);
      return result;
}

const getAllBookings = async () => {
      const result = await pool.query(`SELECT * FROM bookings`);
      return result;
}

export const BookingService = {
      createBooking,
      updateBooking,
      getAllBookings
}