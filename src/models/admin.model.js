import mongoose from "mongoose";



const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 500 },
  created_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;