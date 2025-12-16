import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

      try {
            const result = await UserService.createUser(req.body)
            res.status(201).json({
                  success: true,
                  message: "User created successfully",
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

const getAllUsers = async (req: Request, res: Response) => {
      try {
            const result = await UserService.getAllUsers();
            res.status(200).json({
                  success: true,
                  message: "All users fetched successfully",
                  data: result.rows
            })
      } catch (err : any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch users",
                  error: err.message
            })
      }
}

const getUserById = async (req: Request, res: Response) => {
      try {
            const result = await UserService.getUserById(req.params.id as string)
            res.status(200).json({
                  success: true,
                  message: "User fetched successfully",
                  data: result.rows[0]
            })
      } catch (err : any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch user",
                  error: err.message
            })
      }
}
const updateUser = async (req: Request, res: Response) => {
      try {
            const result = await UserService.updateUser(req.body)
            res.status(200).json({
                  success: true,
                  message: "User updated successfully",
                  data: result.rows[0]
            })
      } catch (err : any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to update user",
                  error: err.message
            })
      }
}
      const deleteUser = async (req: Request, res: Response) => {
            try {
            const result = await UserService.deleteUser(req.params.id as string);
            res.status(200).json({
                  success: true,
                  message: "User deleted successfully",
                  data: result.rows[0]
            })
      } catch (err : any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to delete user",
                  error: err.message
            })
      }
}
export const UserController = {
      createUser,
      getAllUsers,
      getUserById,
      updateUser,
      deleteUser
}