import { pool } from "../../config/db";

const updateUser = async (payload: Record<string, unknown>) => {

      const { id, name, email, phone, role, tokenUserId, tokenUserRole } = payload;
      if (tokenUserId != id && tokenUserRole !== "admin") {
            throw new Error("Unauthorized");
      }
      if (tokenUserRole === "admin") {
            const result = await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role`, [name, email, phone, role, id]);
            return result;
      }
      if (tokenUserRole === "customer" && role == "admin") {
            throw new Error("You are not authorized to update user role to admin");
      }
      const result = await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, role`, [name, email, phone, id]);
      
      return result;
}

const getAllUsers = async () => {
      const result = await pool.query(`SELECT * FROM users`);
      return result;
}

const deleteUser = async (id: string) => {

      const userBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [id]);
      if (userBookings.rows.length > 0) {
            throw new Error("User has bookings");
      }
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
      if (result.rowCount === 0) {
            throw new Error("User not found");
      }
      return result;
}

export const UserService = {
      getAllUsers,
      deleteUser,
      updateUser
}