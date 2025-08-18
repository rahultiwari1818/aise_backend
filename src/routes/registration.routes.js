import express from "express";
import {validateRegistration} from "../middlewares/validations/registration.validation.middleware.js";
import {noOfRegisteredUsers, registerUser} from "../controllers/registration.controller.js";
import paymentRecieptUpload from "../middlewares/payment-reciept-upload.middleware.js";

const router = express.Router();

router.post("/register",paymentRecieptUpload.single("paymentReceipt"),validateRegistration,registerUser);

router.get("/noOfRegisteredUsers",noOfRegisteredUsers);

export default router;