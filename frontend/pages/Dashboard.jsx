import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaginationControls from "../components/PaginationControls";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import FilterBar from "../components/FilterBar";
import {
  clearAuthToken,
  deleteTask,
  getProfile,
  getTaskStats,
  getTasks,
  isUnauthorizedError,
  updateTask,
} from "../services/api";

const initialStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
};

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [actionId, setActionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUnauthorized = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  const handleRequestError = (error, fallbackMessage) => {
    if (isUnauthorizedError(error)) {
      handleUnauthorized();
      return true;
    }

    setErrorMessage(error?.response?.data?.message || fallbackMessage);
    return false;
  };

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.user);
    } catch (error) {
      handleRequestError(error, "Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const taskParams = {
        page,
        limit: pagination.limit,
        sort,
      };

      if (search) {
        taskParams.search = search;
      }

      if (filter !== "All") {
        taskParams.status = filter;
      }

      const [taskResponse, statsResponse] = await Promise.all([
        getTasks(taskParams),
        getTaskStats(),
      ]);

      setTasks(taskResponse.tasks || []);
      setPagination({
        page: taskResponse.page || 1,
        limit: taskResponse.limit || pagination.limit,
        total: taskResponse.total || 0,
        totalPages: taskResponse.totalPages || 1,
      });
      setStats(statsResponse);
      if (taskResponse.page && taskResponse.page !== page) {
        setPage(taskResponse.page);
      }
    } catch (error) {
      if (!handleRequestError(error, "Failed to load dashboard data")) {
        setTasks([]);
        setStats(initialStats);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this task?");

    if (!shouldDelete) {
      return;
    }

    try {
      setActionId(id);
      await deleteTask(id);
      if (tasks.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadDashboardData();
      }
    } catch (error) {
      handleRequestError(error, "Failed to delete task");
    } finally {
      setActionId("");
    }
  };

  const handleComplete = async (task) => {
    if (task.status === "Completed") {
      return;
    }

    try {
      setActionId(task._id);
      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        status: "Completed",
      });
      await loadDashboardData();
    } catch (error) {
      handleRequestError(error, "Failed to update task");
    } finally {
      setActionId("");
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    loadDashboardData();
  }, [page, sort, filter, search]);

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Dashboard</h1>
          <p className="page-subtitle">
            Track, complete, and manage tasks{profile ? `, ${profile.name}` : ""}.
          </p>
        </div>
        <div className="top-actions">
          <Link to="/add" className="primary-link">
            Add Task
          </Link>
          <button type="button" className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <section className="stats-grid">
        <StatsCard label="Total Tasks" value={stats.total} tone="stats-total" />
        <StatsCard label="Pending" value={stats.pending} tone="stats-pending" />
        <StatsCard
          label="In Progress"
          value={stats.inProgress}
          tone="stats-progress"
        />
        <StatsCard
          label="Completed"
          value={stats.completed}
          tone="stats-completed"
        />
      </section>

      <div className="toolbar">
        <FilterBar
          filterValue={filter}
          onFilterChange={(value) => {
            setPage(1);
            setFilter(value);
          }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          sortValue={sort}
          onSortChange={(value) => {
            setPage(1);
            setSort(value);
          }}
        />
      </div>

      {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks found</h2>
          <p>Create a task or change the filter to see more results.</p>
        </div>
      ) : (
        <>
          <section className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
                actionId={actionId}
              />
            ))}
          </section>
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}

export default Dashboard;
