import express from "express";
import { registerForGrant } from "../controllers/grant.controller.js";
import grantDocUpload from "../middlewares/grant-proof-upload.middleware.js";
import { validateGrantRegistration } from "../middlewares/validations/grant.validations.middleware.js";

const router = express.Router();

router.post(
  "/register",
  grantDocUpload.fields([
    { name: "id_proof", maxCount: 1 },
    { name: "college_letter", maxCount: 1 },
  ]),
  validateGrantRegistration,
  registerForGrant
);

export default router;
