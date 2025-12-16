import { Router } from "express";
import { BookingController } from "./booking.controller";

const router = Router();

router.post("/", BookingController.createBooking)
router.get("/", BookingController.getAllBookings)
router.put("/:id", BookingController.updateBooking)

export const bookingRoutes = router