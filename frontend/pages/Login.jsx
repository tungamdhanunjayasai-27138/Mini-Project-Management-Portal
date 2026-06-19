import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, setAuthToken } from "../services/api";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required";
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
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });
      setAuthToken(response.token);
      navigate("/", { replace: true });
    } catch (error) {
      setServerError(error?.response?.data?.message || "Failed to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <section className="form-card auth-card">
        <div className="auth-header">
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">Access your personal task dashboard.</p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          {serverError ? <p className="error-banner">{serverError}</p> : null}
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
              placeholder="Enter your password"
            />
            {errors.password ? (
              <span className="error-text">{errors.password}</span>
            ) : null}
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
