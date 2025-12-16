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

const updateUser = async (payload: Record<string, unknown>) => {
      const {id, name, email, password, phone, role } = payload;
      const result = await pool.query(`UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *`, [name, email, password, phone, role, id]);
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
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
      return result;
}

export const UserService = {
      createUser,
      getAllUsers,
      getUserById,
      deleteUser,
      updateUser
}