import db from "../../config/db.config.js";

export const validateHostelRegistration = async (req, res, next) => {
  try {
    const { emailOrPhone, fromDate, toDate } = req.body;

    // Basic field validation
    if (!emailOrPhone || !fromDate || !toDate || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields including ID proof file are required." });
    }

    // Date validation
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

    // Check if user exists (by email or phone)
    const [user] = await db.execute(
      "SELECT id FROM registrations WHERE email = ? OR phone_number = ? LIMIT 1",
      [emailOrPhone, emailOrPhone]
    );

    if (user.length === 0) {
      return res.status(404).json({
        error: "No registered user found with the given email or phone.",
      });
    }

    const [registeredUser] = await db.execute(
      "select * from hostel_registrations where registration_id = ?",
      [user[0].id]
    );

    if (registeredUser.length !== 0) {
      return res.status(401).json({
        error: "Hostel Room Already Booked by  Registered User !",
      });
    }

    // Attach registration_id for controller use
    req.registrationId = user[0].id;

    next();
  } catch (err) {
    console.error("Hostel registration validation error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
