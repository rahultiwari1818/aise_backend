import User from "../models/registration.model.js";
import GrantRegistration from "../models/grant.model.js";

export const registerForGrant = async (req, res) => {
  try {
    const { email } = req.body;

    // File paths
    const idProofPath = req.files.id_proof[0].path;
    const collegeLetterPath = req.files.college_letter[0].path;

    // Create grant registration
    
    const grant = new GrantRegistration({
      user_id: req.user._id,
      id_proof: idProofPath,
      college_letter: collegeLetterPath,
    });

    await grant.save();

    return res.status(201).json({ message: "Grant registration successful ✅" });
  } catch (error) {
    console.error("Grant registration error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
