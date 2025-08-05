import db from "../config/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [existing] = await db.execute("SELECT id FROM admins");

    if (existing.length > 0)
      return res.status(400).json({ error: "Admin  already exists." });

    const hashed = await bcrypt.hash(password, 10);

    await db.execute("INSERT INTO admins (email, password) VALUES (?, ?)", [
      email,
      hashed,
    ]);

    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    console.error("Admin registration failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    const [admins] = await db.execute("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);

    if (admins.length === 0)
      return res.status(401).json({ error: "Invalid Email Id." });

    const admin = admins[0];
    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) return res.status(401).json({ error: "Invalid Password." });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "30d",
    });

    // ✅ Send token as HTTP-only cookie
    res.cookie("adminToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // use true in production (HTTPS)
      sameSite: "Lax", // or "None" if frontend is on different domain and served over HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 2 days
    });

    return res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Admin Login failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // use true in production (HTTPS)
      sameSite: "Lax", // or "None" if frontend is on different domain and served over HTTPS
    });

    return res.status(200).json({
        message:"Logged Out Successfully!"
    })

  } catch (error) {
    console.error("Admin Logout failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = "SELECT * FROM registrations";
    let values = [];

    if (search) {
      query += ` WHERE 
        name LIKE ? OR 
        email LIKE ? OR 
        phone_number LIKE ? OR 
        affiliation LIKE ? OR 
        category LIKE ? OR 
        gender LIKE ?`;
      const likeSearch = `%${search}%`;
      values = [likeSearch, likeSearch, likeSearch, likeSearch, likeSearch, likeSearch];
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.execute(query, values);
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const getAllHostelRegistrations = async (req, res) => {
  try {
    const search = req.query.search || '';
    const searchQuery = `%${search}%`;

    const [rows] = await db.execute(
      `
      SELECT h.*, r.name, r.email, r.phone_number 
      FROM hostel_registrations h 
      JOIN registrations r ON h.registration_id = r.id
      WHERE 
        r.name LIKE ? OR 
        r.email LIKE ? OR 
        r.phone_number LIKE ? OR 
        h.room_number LIKE ? OR 
        h.status LIKE ? OR 
        DATE_FORMAT(h.from_date, '%Y-%m-%d') LIKE ? OR 
        DATE_FORMAT(h.to_date, '%Y-%m-%d') LIKE ?
      ORDER BY h.created_at DESC
      `,
      [
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery,
        searchQuery
      ]
    );

    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Getting All Hostel Registration failed:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const changeHostelRoomAllocationStatus = async (req, res) => {
  try {
    const { roomNumber, status } = req.body;
    const { hostelId } = req.params;

    if (!hostelId || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid hostel ID or status." });
    }

    // If status is approved, roomNumber must be provided
    if (status === "approved" && (!roomNumber || !roomNumber.trim())) {
      return res.status(400).json({ error: "Room number is required for allocation." });
    }

    let query = "";
    let values = [];
    console.log(status,roomNumber)
    if (status === "approved") {
      query = "UPDATE hostel_registrations SET status = ?, room_number = ? WHERE id = ?";
      values = [status, roomNumber.trim(), hostelId];
    } else {
      query = "UPDATE hostel_registrations SET status = ?, room_number = NULL WHERE id = ?";
      values = [status, hostelId];
    }

    await db.execute(query, values);

    return res.status(200).json({ message: "Hostel status updated successfully." });
  } catch (error) {
    console.error("Changing Hostel Room Allocation Status failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
