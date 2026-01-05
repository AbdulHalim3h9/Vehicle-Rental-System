import { pool } from "../../config/db";

const createBooking = async (
      payload: Record<string, unknown>) => {
      const {
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date
      } = payload;

      const totalAmount = await calculateTotalAmount(
            vehicle_id as string,
            rent_start_date as string,
            rent_end_date as string
      );
      // Check for expired bookings and make vehicles available before creating a new one
      await resolveExpiredBookings();
      const vehicle = await pool.query(
            `SELECT availability_status FROM vehicles WHERE id = $1`,
            [vehicle_id]
      );
      //check if any booking date overlaps with existing bookings
      const existingBookings = await pool.query(
            `SELECT * FROM bookings WHERE ($1 < rent_end_date AND $2 > rent_start_date) LIMIT 1`,
            [rent_start_date, rent_end_date]
      );
      
      if (existingBookings.rows.length > 0) {
            throw new Error("Vehicle is already booked for the selected period");
      }
      
      if (vehicle.rows[0].availability_status === "booked") {
            throw new Error("Vehicle is already booked");
      }

      const status = (new Date(rent_start_date as string) < new Date()) ? "returned" : "active";

      const result = await pool.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                  customer_id,
                  vehicle_id,
                  rent_start_date,
                  rent_end_date,
                  totalAmount,
                  status
            ]
      );
      
      if (status != "returned") {
            await pool.query(
                  `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
                  [vehicle_id]
            );
      } else {
            await pool.query(
                  `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                  [vehicle_id]
            );
      }
      return result;
}


//Customer: Cancel booking (before start date only)
//Admin: Mark as "returned" (updates vehicle to "available")
//System: Auto-mark as "returned" when period ends

const updateBooking = async (payload: Record<string, unknown>) => {
      const {
            bookingId,
            userId,
            vehicleId,
            startDate,
            endDate,
            status,
            tokenUserId
      } = payload;

      const bookingStartDate = new Date(startDate as string).getTime();
      const user = await pool.query(
            `SELECT role FROM users WHERE id = $1`,
            [userId]
      );

      if (user.rows[0].role === "customer" && tokenUserId === userId && bookingStartDate > new Date().getTime()) {
            if (status === "cancelled") {
                  await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2`, ["cancelled", bookingId]);
                  await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, ["available", vehicleId]);
            }
            return { success: true };
      }

      if (user.rows[0].role === "admin") {
            await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [status, bookingId]);
            if (status === "returned") {
                  await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, ["available", vehicleId]);
            }
            return { success: true };
      }

      return { error: "Unauthorized" };
}

const getAllBookings = async () => {
      await resolveExpiredBookings();
      const result = await pool.query(`SELECT * FROM bookings`);
      return result;
}


const calculateTotalAmount = async (
      vehicleId: string,
      rentStartDate: string,
      rentEndDate: string
) => {
      const vehicleDailyRentPrice = await pool.query(
            `SELECT daily_rent_price FROM vehicles WHERE id = $1`, [vehicleId]
      );
      const totalDays = Math.floor(
            (new Date(rentEndDate).getTime() - new Date(rentStartDate).getTime()) /
            (1000 * 60 * 60 * 24)
      );
      const totalAmount = vehicleDailyRentPrice.rows[0].daily_rent_price * totalDays;
      return totalAmount;
}

const resolveExpiredBookings = async () => {
      try {
            const currentTime = new Date().toISOString();

            const expiredBookings = await pool.query(
                  `SELECT id, vehicle_id FROM bookings 
       WHERE status = 'active' 
       AND rent_end_date < $1`,
                  [currentTime]
            );

            for (const booking of expiredBookings.rows) {
                  await pool.query(
                        `UPDATE bookings SET status = $1 WHERE id = $2`,
                        ['returned', booking.id]
                  );

                  await pool.query(
                        `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
                        ['available', booking.vehicle_id]
                  );
            }

            return expiredBookings.rows.length;
      } catch (error) {
            console.error('Error checking expired bookings:', error);
            return 0;
      }
}

export const BookingService = {
      createBooking,
      updateBooking,
      getAllBookings,
      resolveExpiredBookings,
}