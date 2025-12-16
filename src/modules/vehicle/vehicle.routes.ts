import { Router } from "express";
import { VehicleController } from "./vehicle.controller";

const router = Router();

router.post("/", VehicleController.createVehicle)
router.get("/", VehicleController.getAllVehicles)
router.get("/:id", VehicleController.getVehicleById)
router.put("/:id", VehicleController.updateVehicle)
router.delete("/:id", VehicleController.deleteVehicle)

export const vehicleRoutes = router