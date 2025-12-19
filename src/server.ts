import express from "express";
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();
const port = 5000;

app.use(express.json());

initDB();

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/vehicles", vehicleRoutes)
app.use("/api/v1/bookings", bookingRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});