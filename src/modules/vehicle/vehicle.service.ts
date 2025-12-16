import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
      const { id, vehicle_name, type, registration_number, daily_rent_price, availablity_status } = payload;
      const result = await pool.query(`INSERT INTO vehicles (id, vehicle_name, type, registration_number, daily_rent_price, availablity_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [id, vehicle_name, type, registration_number, daily_rent_price, availablity_status]);
      return result;
}

const updateVehicle = async (payload: Record<string, unknown>) => {
      const { id, vehicle_name, type, registration_number, daily_rent_price, availablity_status } = payload;
      const result = await pool.query(`UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availablity_status = $5 WHERE id = $6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availablity_status, id]);
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
      const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
      return result;
}

export const VehicleService = {
      createVehicle,
      updateVehicle,
      getAllVehicles,
      getVehicleById,
      deleteVehicle
}