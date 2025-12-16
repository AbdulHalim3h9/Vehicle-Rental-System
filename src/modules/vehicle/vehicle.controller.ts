import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
      try {
            const result = await VehicleService.createVehicle(req.body)
            res.status(201).json({
                  success: true,
                  message: "Vehicle created successfully",
                  data: result.rows[0]
            })
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to create vehicle",
                  error: err.message
            })
      }
}

const getAllVehicles = async (req: Request, res: Response) => {
      try {
            const result = await VehicleService.getAllVehicles();
            res.status(200).json({
                  success: true,
                  message: "All vehicles fetched successfully",
                  data: result.rows
            })
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch vehicles",
                  error: err.message
            })
      }
}

const getVehicleById = async (req: Request, res: Response) => {
      try {
            const result = await VehicleService.getVehicleById(req.params.id as string)
            res.status(200).json({
                  success: true,
                  message: "Vehicle fetched successfully",
                  data: result.rows[0]
            })
      } catch (err : any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch vehicle",
                  error: err.message
            })
      }
}

const updateVehicle = async (req: Request, res: Response) => {
      try {
            const result = await VehicleService.updateVehicle(req.body)
            res.status(200).json({
                  success: true,
                  message: "Vehicle updated successfully",
                  data: result.rows[0]
            })
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to update vehicle",
                  error: err.message
            })
      }
}

const deleteVehicle = async (req: Request, res: Response) => {
      try {
            const result = VehicleService.deleteVehicle(req.params.id as string);
      } catch (error) {
            
      }
}

export const VehicleController = {
      createVehicle,
      getAllVehicles,
      getVehicleById,
      updateVehicle,
      deleteVehicle
}