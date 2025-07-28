import express from "express";
import cors from "cors";
import registrationRoute from "./routes/registration.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/registration",registrationRoute);





export default app;