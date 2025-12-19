import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
      try {
            const result = await authService.signup(req.body);
            res.status(201).json({
                  success: true,
                  message: "User registered successfully",
                  data: result.rows[0]
            })
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to create user",
                  error: err.message
            })
      }
}

const signin = async (req: Request, res: Response) => {
      try {
            const { email, password } = req.body;
            const result = await authService.signin(email, password)
            console.log(result)
            if (result.status === 'error') {
                  res.status(200).json({
                        success: false,
                        message: result.message
            })
            } else {
                  res.status(200).json({
                  success: true,
                  message: "Login successful",
                  data: result
            });
            }
            
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to sign in user",
                  error: err.message
            })
      }
}

export const authController = {
      signup,
      signin
}