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
            if (result.rows.length === 0) {
                  res.status(200).json({
                        success: true,
                        message: "No vehicles found",
                        data: result.rows
                  })
            } else {
                  res.status(200).json({
                        success: true,
                        message: "Vehicles retrived successfully",
                        data: result.rows
                  })
            }
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
            const result = await VehicleService.getVehicleById(req.params.vehicleId as string)
            if (result.rowCount === 0) {
                  res.status(200).json({
                        success: true,
                        message: "No vehicle found",
                        data: result.rows
                  })
            } else {
                  res.status(200).json({
                        success: true,
                        message: "Vehicle retrieved successfully",
                        data: result.rows[0]
                  })
            }
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
            const result = await VehicleService.updateVehicle({...req.body, vehicleId: req.params.vehicleId})
            if (result.success == false) {
                  res.status(result.statusCode).json({
                        success: result.success,
                        message: result.message,
                  })
            } else {
                  res.status(result.statusCode).json({
                        success: result.success,
                        message: result.message,
                        data: result.data
                  })
            }
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
            // const tokenUserId = req.user?.id;
            const result = await VehicleService.deleteVehicle(req.params.vehicleId as string)
            if (result.success === false) {
                  res.status(result.statusCode).json({
                        success: result.success,
                        message: result.message
                  })
            } else {
                  res.status(result.statusCode).json({
                        success: result.success,
                        message: result.message
                  })
            }
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to delete vehicle",
                  error: err.message
            })
      }
}

export const VehicleController = {
      createVehicle,
      getAllVehicles,
      getVehicleById,
      updateVehicle,
      deleteVehicle
}