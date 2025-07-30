export const registerValidation = async (req, res, next) => {
  try {
    
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    next();
  } catch (error) {
    console.error("Admin Registration Validation error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
