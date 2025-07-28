import express from "express";
import {validateRegistration} from "../middlewares/validations/registration.validation.middleware.js";
import {registerUser} from "../controllers/registration.controller.js";

const router = express.Router();

router.post("/register",validateRegistration,registerUser);

export default router;