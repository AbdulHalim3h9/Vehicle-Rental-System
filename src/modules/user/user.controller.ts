import { Request, Response } from "express";
import { UserService } from "./user.service";

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

const updateUser = async (req: Request, res: Response) => {
      try {
            const tokenUserId = req.user?.id;
            const tokenUserRole = req.user?.role;
            const result = await UserService.updateUser({ ...req.body, tokenUserId, tokenUserRole , id: req.params.userId })
            // res.status(result.statusCode).json({
            //       success: result.status,
            //       message: result.message
            // })
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
            const result = await UserService.deleteUser(req.params.userId as string);
            res.status(200).json({
                  success: true,
                  message: "User deleted successfully",
                  data: result.rows[0]
            })

      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to delete user",
                  error: err.message
            })
      }
}
export const UserController = {
      getAllUsers,
      updateUser,
      deleteUser
}