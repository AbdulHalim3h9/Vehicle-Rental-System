import { Router } from "express";
import { pool } from "../../config/db";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

// router.post("/", UserController.createUser)
router.get("/",auth("admin"), UserController.getAllUsers)
// router.get("/:id", UserController.getUserById)
router.put("/:userId",auth("admin","customer"), UserController.updateUser)
router.delete("/:userId",auth("admin"), UserController.deleteUser)

export const userRoutes = router;
