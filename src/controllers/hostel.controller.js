import db from "../config/db.config.js";

export const registerHostel = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;
    const file = req.file;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const idProofPath = file.path.replace(/\\/g, "/");

    await db.execute(
      `INSERT INTO hostel_registrations 
        (registration_id, from_date, to_date, days, id_proof, status)
        VALUES (?, ?, ?, ?, ?, 'pending')`,
      [req.registrationId, fromDate, toDate, days, idProofPath]
    );

    return res.status(201).json({ message: "Hostel registration submitted successfully." });
  } catch (error) {
    console.error("Hostel registration failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
