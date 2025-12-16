import express from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();
const port = 5000;

app.use(express.json());

initDB();

app.use("/users", userRoutes)
app.use("/vehicles", vehicleRoutes)
app.use("/bookings", bookingRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});