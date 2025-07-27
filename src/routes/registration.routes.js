import express from "express";
import { registrationController } from "../controllers/registration.controller.js";

const router = express.Router();

router.post("/register",registrationController)

export default router;