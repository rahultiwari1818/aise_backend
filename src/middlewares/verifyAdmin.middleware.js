import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach admin data to request
    req.admin = decoded;

    next(); // pass control to next middleware/controller
  } catch (error) {
    console.error("Admin verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
