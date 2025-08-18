import mongoose from "mongoose";

const grantRegistrationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
  id_proof: { type: String, required: true },
  college_letter: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const GrantRegistration = mongoose.model("GrantRegistration", grantRegistrationSchema);

export default GrantRegistration;