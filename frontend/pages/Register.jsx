import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, setAuthToken } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setServerError("");
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setAuthToken(response.token);
      navigate("/", { replace: true });
    } catch (error) {
      setServerError(error?.response?.data?.message || "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <section className="form-card auth-card">
        <div className="auth-header">
          <h1 className="page-title">Register</h1>
          <p className="page-subtitle">Create your account to manage tasks.</p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          {serverError ? <p className="error-banner">{serverError}</p> : null}
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name ? <span className="error-text">{errors.name}</span> : null}
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email ? <span className="error-text">{errors.email}</span> : null}
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
            {errors.password ? (
              <span className="error-text">{errors.password}</span>
            ) : null}
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? "Creating..." : "Register"}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
