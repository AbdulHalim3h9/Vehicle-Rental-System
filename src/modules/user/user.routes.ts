import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/",auth("admin"), UserController.getAllUsers)
router.put("/:userId",auth("admin","customer"), UserController.updateUser)
router.delete("/:userId",auth("admin"), UserController.deleteUser)

export const userRoutes = router;
