import express from "express";
import cors from "cors";
import registrationRouter from "./routes/registration.routes.js"
import { validateRegistrationData } from "./middlewares/validations/registration.validation.middleware.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/registration",validateRegistrationData,registrationRouter);





export default app;