import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  phone_number: { type: String, required: true, unique: true, maxlength: 20 },
  affiliation: { type: String, required: true, maxlength: 100 },
  category: { 
    type: String, 
    enum: ["student", "academician", "industry professional"], 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ["male", "female", "prefer not to say"], 
    required: true 
  },
  fees: { type: mongoose.Decimal128, required: true },
  current_degree: { type: String, maxlength: 100 },
  research_area: { type: String, required: true, maxlength: 255 },
  transaction_id: { type: String, required: true, maxlength: 100 },
  payment_receipt: { type: String, required: true, maxlength: 255 },
  created_at: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;