import { Router } from "express";
import {
  createUser,
  findUserById,
  getUsers,
  updateAvatar,
  updateUser,
} from "../controllers/users";

const router = Router();
router.get("/:userId", findUserById);
router.get("/", getUsers);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);

export default router;
