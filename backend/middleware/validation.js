
 
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(String(email).trim());
}

function validatePhone(phone) {
  const cleanPhone = String(phone).trim().replace(/[\s\-\(\)\.]/g, '');

  const phoneRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
}

function validateDob(dobStr) {
  if (!dobStr) return 'Date of birth is required.';
  const dob = new Date(dobStr + 'T00:00:00');
  if (isNaN(dob.getTime())) return 'Please enter a valid date of birth.';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dob > today) return 'Date of birth cannot be in the future.';


  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 5) return 'Student must be at least 5 years old.';
  if (age > 120) return 'Please enter a valid date of birth.';

  return null;
}

function validateStudentInput(req, res, next) {
  const { name, email, phone, date_of_birth, gender, course, address } = req.body;
  const errors = {};

  // 1. Name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required.';
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    } else if (trimmedName.length > 80) {
      errors.name = 'Name must not exceed 80 characters.';
    }
  }

  // 2. Email
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!validateEmail(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  // 3. Phone
  if (!phone || (typeof phone !== 'string' && typeof phone !== 'number') || !String(phone).trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!validatePhone(phone)) {
    errors.phone = 'Please provide a valid 10-digit Indian phone number.';
  }

  // 4. Date of Birth
  const dobError = validateDob(date_of_birth);
  if (dobError) {
    errors.date_of_birth = dobError;
  }

  // 5. Gender
  if (!gender || typeof gender !== 'string' || !gender.trim()) {
    errors.gender = 'Gender selection is required.';
  }

  // 6. Course
  if (!course || typeof course !== 'string' || !course.trim()) {
    errors.course = 'Course selection is required.';
  }

  // 7. Address
  if (!address || typeof address !== 'string' || !address.trim()) {
    errors.address = 'Residential address is required.';
  } else {
    const trimmedAddress = address.trim();
    if (trimmedAddress.length < 10) {
      errors.address = 'Address must be at least 10 characters long.';
    } else if (trimmedAddress.length > 400) {
      errors.address = 'Address must not exceed 400 characters.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the entered fields.',
      errors
    });
  }

  next();
}

module.exports = {
  validateStudentInput
};
