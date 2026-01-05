import { Request, Response } from "express";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
      try {
            const result = await BookingService.createBooking(req.body)
            res.status(201).json({
                  success: true,
                  message: "Booking created successfully",
                  data: result.rows[0]
            })
      }
      catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to create booking",
                  error: err.message
            })
      }
}

const updateBooking = async (req: Request, res: Response) => {
      try {
            const tokenUserId = req.user?.id;
            const result = await BookingService.updateBooking({ ...req.body, userId: tokenUserId })
      res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result
      })
      } catch (err: any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to update booking",
                  error: err.message
            })
      }
}

const getAllBookings = async (req: Request, res: Response) => {
      try {
            const tokenUserId = req.user?.id;
            const tokenRole = req.user?.role;
            if (!tokenUserId) {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized"
                  });
            }
            const result = await BookingService.getAllBookings(tokenUserId, tokenRole);
            res.status(200).json({
                  success: true,
                  message: "All bookings fetched successfully",
                  data: result.rows
            })
      } catch (err : any) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch bookings",
                  error: err.message
            })
      }
}

export const BookingController = {
      createBooking,
      updateBooking,
      getAllBookings
}