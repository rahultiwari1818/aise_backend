import express from "express";
import { validateHostelRegistration } from "../middlewares/validations/hostelRegistration.validation.middleware.js";
import { registerHostel } from "../controllers/hostel.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register",upload.single("idProof"),validateHostelRegistration,registerHostel);

export default router;