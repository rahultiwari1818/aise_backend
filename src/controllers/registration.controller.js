import Registration from "../models/registration.model.js";
import UserRegistration from "../models/registration.model.js";

// Fee mapping based on category
const feeMap = {
  student: 472,
  academician: 944,
  "industry professional": 1770,
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      address,
      email,
      phone,
      affiliation,
      category,
      gender,
      degree,
      researchArea,
      transactionId,
    } = req.body;

    const file = req.file;
    const payment_receipt = file?.path ? file.path.replace(/\\/g, "/") : null;

    // ✅ Check if email or phone already exists
    const existing = await UserRegistration.findOne({
      $or: [{ email }, {phone_number: phone }],
    });

    if (existing) {
      if (existing.email === email) {
        return res.status(409).json({ error: "Email already registered" });
      }
      if (existing.phone === phone) {
        return res
          .status(409)
          .json({ error: "Phone number already registered" });
      }
    }

    // ✅ Calculate fees
    const fees = feeMap[category.toLowerCase()];
    if (fees === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid category for fee calculation" });
    }

    // ✅ Save new registration
    const newUser = new UserRegistration({
      name,
      address,
      email,
      phone_number:phone,
      affiliation,
      category: category.toLowerCase(),
      gender: gender.toLowerCase(),
      current_degree: category.toLowerCase() === "student" ? degree : null,
      research_area:researchArea,
      transaction_id:transactionId,
      payment_receipt: payment_receipt,
      fees,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const noOfRegisteredUsers = async (req, res) => {
  try {

    const data = await Registration.find();

    return res.status(200).json({
      data:data.length
    })

  } catch (error) {
    console.error("No Of Registered error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
