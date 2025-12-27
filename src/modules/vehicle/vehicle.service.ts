import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
      const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
      const result = await pool.query(`INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
      console.log(result)
      return result;
}

const updateVehicle = async (payload: Record<string, unknown>) => {
      const { vehicleId, vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
      
      const result = await pool.query(`UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId]);
      console.log(vehicleId)
      return result;
}

const getAllVehicles = async () => {
      const result = await pool.query(`SELECT * FROM vehicles`);
      return result;
}

const getVehicleById = async (id : string) => {
      const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
      return result;
}


const deleteVehicle = async (id: string) => {
      const { rows: bookings } = await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1`, [id]);
      if (bookings.length === 0) {
            const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
            if (result.rows[0]) {
                  return {status: "success", message: "Vehicle deleted successfully"};
            } else {
                  return {status: "error", message: "Vehicle not found"};
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