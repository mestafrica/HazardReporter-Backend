import express from "express";
import controller from "../controllers/user";
import { checkAuth, hasPermission } from "../middlewares/auth";
import upload from "../middlewares/upload";

const router = express.Router();

// Define user routes
router.post("/users/register", upload.single('avatar'), controller.register);
router.post("/users/login", controller.login);
router.patch(
    "/users/",
    checkAuth,
    hasPermission("create_user"),
    upload.single('avatar'),
    controller.createUser,
);
router.patch(
    "/users/:id",
    checkAuth,
    hasPermission("update_user"),
    upload.single('avatar'),
    controller.editUser,
);
router.delete(
    "/users/:id",
    checkAuth,
    hasPermission("delete_user"),
    controller.deleteUser,
);
router.post("/users/logout", checkAuth, controller.logout);

// Export router
export default router;