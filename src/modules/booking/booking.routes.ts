import { Router } from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/",auth("admin","customer"), BookingController.createBooking)
router.get("/",auth("admin"), BookingController.getAllBookings)
router.put("/:bookingId",auth("admin","customer"), BookingController.updateBooking)

export const bookingRoutes = router