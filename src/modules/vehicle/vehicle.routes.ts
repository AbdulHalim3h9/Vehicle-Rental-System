import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/",auth("admin") , VehicleController.createVehicle)
router.get("/", VehicleController.getAllVehicles)
router.get("/:vehicleId", VehicleController.getVehicleById)
router.put("/:vehicleId",auth("admin") , VehicleController.updateVehicle)
router.delete("/:vehicleId",auth("admin") , VehicleController.deleteVehicle)

export const vehicleRoutes = router