export const validateRegistration = (req, res, next) => {
  const { name, address, email, phone, affiliation, category, gender } = req.body;

  const errors = {};

  if (!name || name.trim() === "") errors.name = "Name is required.";
  if (!address || address.trim() === "") errors.address = "Address is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required.";
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) errors.phone = "Valid 10-digit Indian phone number required.";
  if (!affiliation || affiliation.trim() === "") errors.affiliation = "Affiliation is required.";

  const validCategories = ["student", "academician", "industry professional"];
  if (!category || !validCategories.includes(category.toLowerCase()))
    errors.category = "Category must be Student, Academician, or Industry Professional.";

  const validGenders = ["male", "female", "prefer not to say"];
  if (!gender || !validGenders.includes(gender.toLowerCase()))
    errors.gender = "Gender must be Male, Female, or Prefer not to say.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
