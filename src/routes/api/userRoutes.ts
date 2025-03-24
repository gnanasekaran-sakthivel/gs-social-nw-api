import { Router } from "express";
const router = Router();
import {
  getAllUsers,
  getUSerById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} from "../../controllers/userController.js";

// /api/users
router.route("/").get(getAllUsers).post(createUser);

// /api/users/:userId
router.route("/:userId").get(getUSerById).put(updateUser).delete(deleteUser);

router.route("/:userId/friends").post(addFriend);
router.route("/:userId/friends/:friendId").delete(removeFriend);

export { router as userRouter };
