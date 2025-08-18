import UserRegistration from "../../models/registration.model.js";
import GrantRegistration from "../../models/grant.model.js";

export const validateGrantRegistration = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id_proof, college_letter } = req.files || {};

    // Step 1: Validate request fields
    if (!email || !id_proof || !college_letter) {
      return res.status(400).json({
        error: "Email, ID proof, and College Letter are required.",
      });
    }

    // Step 2: Check if user exists
    const user = await UserRegistration.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "No registered user found with the given email.",
      });
    }

    // Step 3: Check if grant already applied
    const existingGrant = await GrantRegistration.findOne({
      user_id: user._id,
    });

    if (existingGrant) {
      return res.status(409).json({
        error: "User has already applied for the grant.",
      });
    }

    // Step 4: Attach user info for controller
    req.user = user;

    next();
  } catch (err) {
    console.error("Grant registration validation error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
