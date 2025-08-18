import HostelRegistration from "../models/hostel.model.js";
import User from "../models/registration.model.js";

export const registerHostel = async (req, res) => {
  try {
    const { fromDate, toDate, emailOrPhone } = req.body;
    const file = req.file;
    const user = await User.findOne({
      $or: [{ email:emailOrPhone  }, { phone_number: emailOrPhone }],
    });

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const idProofPath = file.path.replace(/\\/g, "/");

    const registration = new HostelRegistration({
      registration_id: user._id,
      from_date:fromDate,
      to_date:toDate,
      days,
      id_proof: idProofPath,
      status: "pending",
    });

    await registration.save();

    return res
      .status(201)
      .json({ message: "Hostel registration submitted successfully." });
  } catch (error) {
    console.error("Hostel registration failed:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
