const VALID_STATUSES = ["Pending", "In Progress", "Completed"];

const formatTask = (row) => ({
  id: row.id,
  _id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  createdAt: row.created_at instanceof Date
    ? row.created_at.toISOString()
    : row.created_at,
});

const validateTaskPayload = (payload = {}, { partial = false } = {}) => {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  const status = typeof payload.status === "string" ? payload.status.trim() : "";

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "title")) {
    if (!title) {
      return "Title is required";
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "description")) {
    if (description.length < 20) {
      return "Description must be at least 20 characters";
    }
  }

  if (
    (!partial || Object.prototype.hasOwnProperty.call(payload, "status")) &&
    status &&
    !VALID_STATUSES.includes(status)
  ) {
    return "Status must be Pending, In Progress, or Completed";
  }

  return null;
};

const isValidTaskId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const normalizeTaskFilters = (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const status = typeof query.status === "string" ? query.status.trim() : "";
  const sort = query.sort === "oldest" ? "oldest" : "newest";

  if (status && !VALID_STATUSES.includes(status)) {
    return { error: "Invalid status filter" };
  }

  return {
    page,
    limit,
    search,
    sort,
    status,
  };
};

module.exports = {
  VALID_STATUSES,
  formatTask,
  validateTaskPayload,
  isValidTaskId,
  normalizeTaskFilters,
};
