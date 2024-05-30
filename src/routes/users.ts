import { Router } from "express";
import {
  createUser,
  findCurrentUserById,
  findUserById,
  getUsers,
  updateAvatar,
  updateUser,
} from "../controllers/users";
import {
  validateUserId,
  validateUpdateUser,
  validateUpdateAvatar,
} from "../validator/validator";

const router = Router();
router.get("/me", findCurrentUserById);
router.get("/:userId", validateUserId, findUserById);
router.get("/", getUsers);
router.patch("/me", validateUpdateUser, updateUser);
router.patch("/me/avatar", validateUpdateAvatar, updateAvatar);

export default router;
