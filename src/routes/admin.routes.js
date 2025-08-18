import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { changeHostelRoomAllocationStatus, getAllHostelRegistrations, getAllUsers, loginAdmin, logout, registerAdmin } from "../controllers/admin.controller.js";
import { registerValidation } from "../middlewares/validations/admin.validations.middleware.js";

const router = express.Router();


router.post("/register",registerValidation,registerAdmin);

router.post("/login",loginAdmin);

router.get("/getAllUsers",verifyAdmin,getAllUsers);

router.get("/getAllHostelBookings",verifyAdmin,getAllHostelRegistrations);


router.get("/getAllGrantRegistrations",verifyAdmin,getAllHostelRegistrations);

router.put("/changeBookingStatus/:hostelId",verifyAdmin,changeHostelRoomAllocationStatus);

router.post("/logout",verifyAdmin,logout);



export default router;