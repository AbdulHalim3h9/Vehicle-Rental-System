import { pool } from "../../config/db";

const updateUser = async (payload: Record<string, unknown>) => {

      const { id, name, email, phone, role, tokenUserId, tokenUserRole } = payload;
      if (tokenUserId != id && tokenUserRole !== "admin") {
            return { 
                  statusCode: 401,
                  status: "error", 
                  message: "Unauthorized" 
            };
      }
      if (tokenUserRole === "admin") {
            await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`, [name, email, phone, role, id]);

            return {
                  statusCode: 200,
                  success: true, 
                  message: "User updated successfully" 
            };
      }
      await pool.query(`UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`, [name, email, phone, id]);

      return {
            statusCode: 200,
            success: true, 
            message: "User updated successfully" 
      };
}

const getAllUsers = async () => {
      const result = await pool.query(`SELECT * FROM users`);
      return result;
}

const deleteUser = async (id: string) => {

      const userBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [id]);
      if (userBookings.rows.length > 0) {
            return { 
                  statusCode: 403,
                  status: "error", 
                  message: "User has bookings" 
            };
      }
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
      if (result.rowCount === 0) {
            return { 
                  statusCode: 404,
                  status: "error", 
                  message: "User not found" 
            };
      }
      return {
            statusCode: 200, 
            status: "success", 
            message: "User deleted successfully" 
      };
}

export const UserService = {
      getAllUsers,
      deleteUser,
      updateUser
}