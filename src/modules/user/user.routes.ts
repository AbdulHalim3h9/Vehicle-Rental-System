import { Router } from "express";
import { pool } from "../../config/db";
import { UserController } from "./user.controller";

const router = Router();

router.post("/", UserController.createUser)
router.get("/", UserController.getAllUsers)
router.get("/:id", UserController.getUserById)
router.put("/:id", UserController.updateUser)
router.delete("/:id", UserController.deleteUser)

export const userRoutes = router;
