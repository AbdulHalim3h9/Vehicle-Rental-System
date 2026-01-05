import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signup = async (payload: Record<string, unknown>) => {
      const {name,email, phone, role, password} = payload

      const hashedPassword = await bcrypt.hash(password as string, 10)

      const result = await pool.query(`INSERT INTO users (name,email, phone, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`, [name,email, phone, role, hashedPassword])
      return result;
}

const signin = async (email: string, password: string) => {
      const result = await pool.query(`SELECT id, name, email, phone, role, password FROM users WHERE email = $1`, [email])
      const user = result.rows[0]
      if (!user) {
            return { status: 'error', message: 'User not found' };
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password)
      if (!isPasswordMatched) {
            return { status: 'error', message: 'Invalid password' };
      }
      const token = jwt.sign({ id: user.id,
            email: user.email,
            role: user.role
       }, config.jwt_secret!, { expiresIn: '1d' });
      const { password: _, ...userWithoutPassword } = user;
      return { token, user: userWithoutPassword };
}

export const authService = {
      signup,
      signin
}