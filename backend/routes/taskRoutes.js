const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");
const authenticateUser = require("../config/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.get("/stats", getTaskStats);
router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
