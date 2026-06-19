const db = require("../config/db");
const {
  formatTask,
  validateTaskPayload,
  isValidTaskId,
  normalizeTaskFilters,
} = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const filters = normalizeTaskFilters(req.query);

    if (filters.error) {
      return res.status(400).json({ message: filters.error });
    }

    const { page, limit, search, sort, status } = filters;
    const hasAdvancedQuery =
      Boolean(req.query.page) ||
      Boolean(req.query.limit) ||
      Boolean(req.query.search) ||
      Boolean(req.query.sort) ||
      Boolean(req.query.status);

    if (!hasAdvancedQuery) {
      const [rows] = await db.query(
        `SELECT id, title, description, status, created_at
         FROM tasks
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

      return res.status(200).json(rows.map(formatTask));
    }

    const conditions = ["user_id = ?"];
    const params = [req.user.id];

    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const sortDirection = sort === "oldest" ? "ASC" : "DESC";
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM tasks ${whereClause}`,
      params
    );

    const total = countRows[0]?.total || 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const [rows] = await db.query(
      `SELECT id, title, description, status, created_at
       FROM tasks
       ${whereClause}
       ORDER BY created_at ${sortDirection}
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    res.status(200).json({
      tasks: rows.map(formatTask),
      page: safePage,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const validationError = validateTaskPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const title = req.body.title.trim();
    const description = req.body.description.trim();
    const status = req.body.status || "Pending";

    const [result] = await db.query(
      "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)",
      [title, description, status, req.user.id]
    );

    const [rows] = await db.query(
      `SELECT id, title, description, status, created_at
       FROM tasks
       WHERE id = ? AND user_id = ?`,
      [result.insertId, req.user.id]
    );

    res.status(201).json(formatTask(rows[0]));
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!isValidTaskId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const validationError = validateTaskPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const id = Number(req.params.id);
    const title = req.body.title.trim();
    const description = req.body.description.trim();
    const status = req.body.status;

    const [result] = await db.query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description, status, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const [rows] = await db.query(
      `SELECT id, title, description, status, created_at
       FROM tasks
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    res.status(200).json(formatTask(rows[0]));
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!isValidTaskId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const [result] = await db.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [Number(req.params.id), req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inProgress,
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed
       FROM tasks
       WHERE user_id = ?`,
      [req.user.id]
    );

    const stats = rows[0] || {};

    res.status(200).json({
      total: Number(stats.total) || 0,
      pending: Number(stats.pending) || 0,
      inProgress: Number(stats.inProgress) || 0,
      completed: Number(stats.completed) || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task statistics" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
