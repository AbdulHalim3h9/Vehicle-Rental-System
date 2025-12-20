import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
      const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

      const calculateTotalAmount = async (vehicleId: string, rentStartDate: string, rentEndDate: string) => {
            const vehicleDailyRentPrice = await pool.query(`SELECT daily_rent_price FROM vehicles WHERE id = $1`, [vehicleId]);
            const totalDays = Math.floor((new Date(rentEndDate).getTime() - new Date(rentStartDate).getTime()) / (1000 * 60 * 60 * 24));
            const totalAmount = vehicleDailyRentPrice.rows[0].daily_rent_price * totalDays;
            return totalAmount;
      }

      const totalAmount = await calculateTotalAmount(vehicle_id as string, rent_start_date as string, rent_end_date as string);
      
      const result = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalAmount]);
      return result;
}

//Customer: Cancel booking (before start date only)
//Admin: Mark as "returned" (updates vehicle to "available")
//System: Auto-mark as "returned" when period ends

const updateBooking = async (payload: Record<string, unknown>) => {
      const { bookingId, userId, vehicleId, startDate, endDate, status, tokenUserId } = payload;
      const bookingStartDate = new Date(startDate as string).getTime();
      const user = await pool.query(`SELECT role FROM users WHERE id = $1`, [userId]);

      if (user.rows[0].role === "customer" && tokenUserId === userId && bookingStartDate > new Date().getTime()) {
            await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [status, bookingId]);
            return { success: true };
      }

      if (user.rows[0].role === "admin") {
            await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [status, bookingId]);
            if (status === "returned") {
                  await pool.query(`UPDATE vehicles SET availablity_status = $1 WHERE id = $2`, ["available", vehicleId]);
            }
            await pool.query(`UPDATE vehicles SET availablity_status = $1 WHERE id = $2`, ["returned", vehicleId]);
            return { success: true };
      }

      return { error: "Unauthorized" };
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