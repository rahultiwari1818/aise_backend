import UserRegistration from "../../models/registration.model.js";
import HostelRegistration from "../../models/hostel.model.js";

export const validateHostelRegistration = async (req, res, next) => {
  try {
    const { emailOrPhone, fromDate, toDate } = req.body;

    if (!emailOrPhone || !fromDate || !toDate || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields including ID proof file are required." });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const min = new Date("2026-01-06");
    const max = new Date("2026-01-11");

    if (from < min || to > max || from > to) {
      return res.status(400).json({
        error:
          "Dates must be between Jan 6 and Jan 11, 2026, and From Date should be earlier than To Date.",
      });
    }

    // Check if user exists by email or phone
    const user = await UserRegistration.findOne({
      $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
    });
    

    if (!user) {
      return res.status(404).json({
        error: "No registered user found with the given email or phone.",
      });
    }

    // Check if hostel is already booked by this user
    const registeredUser = await HostelRegistration.findOne({
      registration_id: user._id,
    });


    if (registeredUser) {
      return res.status(401).json({
        error: "Hostel Room Already Booked by Registered User!",
      });
    }

    // Attach registrationId for controller
    req.registrationId = user._id;

    next();
  } catch (err) {
    console.error("Hostel registration validation error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
