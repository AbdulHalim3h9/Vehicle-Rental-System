import { pool } from "../../config/db";
import { Request, Response } from "express";

const createUser = async (payload: Record<string, unknown>) => {
      const { name, email, password, phone, role } = payload;
      const result = await pool.query(`
            INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
            `,
            [name, email, password, phone, role]
            );
            return result;
}
//update own profile > customer
//update any user > admin
const updateUser = async (payload: Record<string, unknown>) => {
      
      const {id, name, email, phone, role, tokenUserId, tokenUserRole } = payload;
      console.log(tokenUserId, id)
      if (tokenUserId != id && tokenUserRole !== "admin") {
            return { error: "Unauthorized" };
      }
      console.log("Updating user:", { name, email, phone, role, id });
      if (tokenUserRole === "admin") {
            const result = await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`, [name, email, phone, role, id]);
            return result;
      }
      const result = await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`, [name, email, phone, id]);
      return result;
}

const getAllUsers = async () => {
      const result = await pool.query(`SELECT * FROM users`);
      return result;
}

const getUserById = async (id : string) => {
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return result;
}

const deleteUser = async (id : string) => {

      const userBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [id]);
      if(userBookings.rows.length > 0) {
            return { status: "error", message: "User has bookings" };
      }
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
      if (result.rowCount === 0) {
            return { status: "error", message: "User not found" };
      }
      return { status: "success", message: "User deleted successfully" };
}

export const UserService = {
      createUser,
      getAllUsers,
      getUserById,
      deleteUser,
      updateUser
}