import express from "express";
import cors from "cors";
import registrationRoute from "./routes/registration.routes.js";
import hostelRoute from "./routes/hostel.routes.js";
import adminRoute from "./routes/admin.routes.js";
import grantRoute from "./routes/grant.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.config.js";


const app = express();

// To handle __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const allowedOrigins = ["http://localhost:8080", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, //
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/uploads", express.static("uploads"));


app.use("/api/v1/registration", registrationRoute);

app.use("/api/v1/hostel", hostelRoute);

app.use("/api/v1/admin", adminRoute);

app.use("/api/v1/grant",grantRoute);

app.use((req,res)=>{
  res.send("Not Found")
})

connectDB();

export default app;
