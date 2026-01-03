import { pool } from "../../config/db";
// Add at the top of vehicle.service.ts:
import { BookingService } from "../booking/booking.service";

const createVehicle = async (payload: Record<string, unknown>) => {
      const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
      const result = await pool.query(`INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
      console.log(result)
      return result;
}

const updateVehicle = async (payload: Record<string, unknown>) => {
      const { vehicleId, vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (vehicle_name) {
            updates.push(`vehicle_name = $${paramIndex++}`);
            values.push(vehicle_name);
      }
      if (type) {
            updates.push(`type = $${paramIndex++}`);
            values.push(type);
      }
      if (registration_number) {
            updates.push(`registration_number = $${paramIndex++}`);
            values.push(registration_number);
      }
      if (daily_rent_price) {
            updates.push(`daily_rent_price = $${paramIndex++}`);
            values.push(daily_rent_price);
      }
      if (availability_status) {
            updates.push(`availability_status = $${paramIndex++}`);
            values.push(availability_status);
      }
      if (updates.length === 0) {
            return { status: "error", message: "No updates provided" };
      }
      const result = await pool.query(`UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`, [...values, vehicleId]);
      console.log(vehicleId)
      return { status: "success", message: "Vehicle updated successfully", data: result.rows[0] };
}

const getAllVehicles = async () => {
      await BookingService.resolveExpiredBookings();
      const result = await pool.query(`SELECT * FROM vehicles`);
      return result;
}

const getVehicleById = async (id: string) => {
      await BookingService.resolveExpiredBookings();
      const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
      return result;
}


const deleteVehicle = async (id: string) => {
      const { rows: bookings } = await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1`, [id]);
      if (bookings.length === 0) {
            const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
            if (result.rows[0]) {
                  return { status: "success", message: "Vehicle deleted successfully" };
            } else {
                  return { status: "error", message: "Vehicle not found" };
            }
      }
      return { status: "error", message: "Vehicle is currently booked" };
}

export const VehicleService = {
      createVehicle,
      updateVehicle,
      getAllVehicles,
      getVehicleById,
      deleteVehicle
}