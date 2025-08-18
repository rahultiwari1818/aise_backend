import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Registration from "../models/registration.model.js";
import HostelRegistration from "../models/hostel.model.js";
import { sendMail } from "../config/email.config.js";
import { hostelAllocationUpdateBody } from "../utils/email.utils.js";
import { formatDateToDDMMYYYY } from "../utils/dateUtils.js";
import GrantRegistration from "../models/grant.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Admin.findOne({});
    if (existing) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await Admin.create({ email, password: hashed });

    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    console.error("Admin registration failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid Email Id." });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Invalid Password." });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("adminToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Admin Login failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Logout Admin
export const logout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res.status(200).json({ message: "Logged Out Successfully!" });
  } catch (error) {
    console.error("Admin Logout failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Get All Users with Search
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone_number: { $regex: search, $options: "i" } },
          { affiliation: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { gender: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await Registration.find(query).sort({ created_at: -1 });
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Get All Hostel Registrations with Search
export const getAllHostelRegistrations = async (req, res) => {
  try {
    const search = req.query.search || "";

    const hostels = await HostelRegistration.find({
      $or: [
        { status: { $regex: search, $options: "i" } },
        { room_number: { $regex: search, $options: "i" } },
      ],
    })
      .populate("registration_id", "name email phone_number") // joins with Registration
      .sort({ created_at: -1 });

    res.status(200).json({ data: hostels });
  } catch (error) {
    console.error("Getting All Hostel Registration failed:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Change Hostel Room Allocation Status
export const changeHostelRoomAllocationStatus = async (req, res) => {
  try {
    const { roomNumber, status } = req.body;
    const { hostelId } = req.params;

    if (!hostelId || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid hostel ID or status." });
    }

    const updateData =
      status === "approved"
        ? { status, room_number: roomNumber?.trim() }
        : { status, room_number: null };

    const data =     await HostelRegistration.findByIdAndUpdate(hostelId, updateData);

     const user = await Registration.findOne({_id:data.registration_id})
     
    try {

     const response = await sendMail(user.email,"Hostel Allocation Status - AISE 2026",hostelAllocationUpdateBody(user.name,user.email,status,roomNumber,formatDateToDDMMYYYY( data.from_date),formatDateToDDMMYYYY(data.to_date)))
      console.log("Response while Sending Mail : ",response)
    } catch (error) {
      console.log("Error While Sending Mail : ",error);
    }

    return res.status(200).json({ message: "Hostel status updated successfully." });
  } catch (error) {
    console.error("Changing Hostel Room Allocation Status failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const getGrantRegistrationDetails = async (req, res) => {
  try {
    const search = req.query.search || "";

    let matchQuery = {};
    if (search) {
      matchQuery = {
        $or: [
          { "user_id.email": { $regex: search, $options: "i" } },
          { "user_id.phone": { $regex: search, $options: "i" } },
          { "user_id.name": { $regex: search, $options: "i" } }
        ]
      };
    }

    const grants = await GrantRegistration.find()
      .populate("user_id", "name email phone") // only fetch these fields
      .find(matchQuery);

    res.status(200).json({ data: grants });
  } catch (error) {
    console.error("Getting All Grant Registration failed:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};