
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phoneNumber);
};

export const validateCIN = (cin) => {
  const cinRegex = /^[0-9]{8}$/;
  return cinRegex.test(cin?.trim());
};

export const areRequiredFieldsFilled = (formData, fields) => {
  return fields.every((field) => formData[field]?.trim());
};
