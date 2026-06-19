const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: row.created_at instanceof Date
    ? row.created_at.toISOString()
    : row.created_at,
});

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const validateRegisterPayload = (payload = {}) => {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!name) {
    return "Name is required";
  }

  if (!email) {
    return "Email is required";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Valid email is required";
  }

  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

const validateLoginPayload = (payload = {}) => {
  const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email) {
    return "Email is required";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Valid email is required";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};

module.exports = {
  formatUser,
  normalizeEmail,
  validateRegisterPayload,
  validateLoginPayload,
};
