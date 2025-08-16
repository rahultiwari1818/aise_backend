export const validateRegistration = (req, res, next) => {
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
    transactionId
  } = req.body;

  const errors = {};

  if (!name || name.trim() === "") errors.name = "Name is required.";
  if (!address || address.trim() === "") errors.address = "Address is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
    errors.email = "Valid email is required.";
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) 
    errors.phone = "Valid 10-digit Indian phone number required.";
  if (!affiliation || affiliation.trim() === "") 
    errors.affiliation = "Affiliation is required.";

  const validCategories = ["student", "academician", "industry professional"];
  if (!category || !validCategories.includes(category.toLowerCase())) {
    errors.category = "Category must be Student, Academician, or Industry Professional.";
  }

  const validGenders = ["male", "female", "prefer not to say"];
  if (!gender || !validGenders.includes(gender.toLowerCase())) {
    errors.gender = "Gender must be Male, Female, or Prefer not to say.";
  }

  // ✅ Student-specific validation
  if (category?.toLowerCase() === "student" && (!degree || degree.trim() === "")) {
    errors.degree = "Current degree is required for students.";
  }

  // ✅ Research Area required always
  if (!researchArea || researchArea.trim() === "") {
    errors.researchArea = "Research area / Project / Interest is required.";
  }

  // ✅ Transaction ID required
  if (!transactionId || transactionId.trim() === "") {
    errors.transactionId = "Transaction ID is required.";
  }

  // ✅ Payment receipt must be uploaded (PDF only)
  if (!req.file) {
    errors.paymentReceipt = "Payment receipt (PDF) is required.";
  } else if (req.file.mimetype !== "application/pdf") {
    errors.paymentReceipt = "Payment receipt must be a PDF file.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
