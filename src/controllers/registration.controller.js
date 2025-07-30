import db from "../config/db.config.js";

// Fee mapping based on category
const feeMap = {
  student: 500.00,
  academician: 1000.00,
  "industry professional": 2000.00,
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
    } = req.body;

    const fees = feeMap[category.toLowerCase()];
    if (fees === undefined) {
      return res.status(400).json({ error: "Invalid category for fee calculation" });
    }

    const query = `
      INSERT INTO registrations 
      (name, address, email, phone_number, affiliation, category, gender, fees) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      name,
      address,
      email,
      phone,
      affiliation,
      category.toLowerCase(),
      gender.toLowerCase(),
      fees,
    ]);

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      const duplicateField = error.message.includes("email") ? "email" : "phone number";
      return res.status(409).json({ error: `Duplicate ${duplicateField} detected.` });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};


