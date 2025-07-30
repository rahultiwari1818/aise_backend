import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { changeHostelRoomAllocationStatus, getAllHostelRegistrations, getAllUsers, loginAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { registerValidation } from "../middlewares/validations/admin.validations.middleware.js";

const router = express.Router();


router.post("/register",registerValidation,registerAdmin);

router.post("/login",loginAdmin);

router.get("/getAllUsers",verifyAdmin,getAllUsers);

router.get("/getAllHostelBookings",verifyAdmin,getAllHostelRegistrations);

router.patch("/changeBookingStatus",verifyAdmin,changeHostelRoomAllocationStatus)

export default router;