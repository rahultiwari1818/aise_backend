import mongoose from "mongoose";



const hostelRegistrationSchema = new mongoose.Schema({
  registration_id: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" },
  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  days: { type: Number, required: true },
  id_proof: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  room_number: { type: String, maxlength: 10 },
  created_at: { type: Date, default: Date.now }
});

const HostelRegistration = mongoose.model("HostelRegistration", hostelRegistrationSchema);

export default HostelRegistration;