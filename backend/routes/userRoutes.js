import express from "express";
import { createUser, loginUser, logoutUser, getUsers, getCurrentUser, updateCurrentUser, updateUser, deleteUser, getUser } from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route("/").post(createUser).get(authenticate, authorizeAdmin, getUsers)
router.post("/auth", loginUser)
router.post("/logout", logoutUser)
router.route("/profile").get(authenticate, getCurrentUser).put(authenticate, updateCurrentUser)

// ADMIN ROUTES
router
.route("/:id")
.delete(authenticate, authorizeAdmin, deleteUser)
.get(authenticate, authorizeAdmin, getUser)
.put(authenticate, authorizeAdmin, updateUser)

export default router