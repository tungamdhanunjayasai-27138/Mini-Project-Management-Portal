import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  clearAuthToken,
  createTask,
  isUnauthorizedError,
} from "../services/api";

const initialForm = {
  title: "",
  description: "",
  status: "Pending",
};

function AddTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (formData.description.trim().length < 20) {
      nextErrors.description = "Description must be at least 20 characters";
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
      await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });
      navigate("/");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        clearAuthToken();
        navigate("/login", { replace: true });
        return;
      }

      setServerError(error?.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Task</h1>
          <p className="page-subtitle">Create a new task for your project.</p>
        </div>
        <div className="top-actions">
          <Link to="/" className="secondary-button">
            Dashboard
          </Link>
          <button type="button" className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <section className="form-card">
        <form className="task-form" onSubmit={handleSubmit}>
          {serverError ? <p className="error-banner">{serverError}</p> : null}
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
            {errors.title ? <span className="error-text">{errors.title}</span> : null}
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter at least 20 characters"
            />
            {errors.description ? (
              <span className="error-text">{errors.description}</span>
            ) : null}
          </div>

          <div className="form-row">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? "Saving..." : "Create Task"}
            </button>
            <Link to="/" className="secondary-button">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddTask;
