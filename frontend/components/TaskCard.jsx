function TaskCard({ task, onComplete, onDelete, actionId }) {
  const statusClassMap = {
    Pending: "status-pending",
    "In Progress": "status-progress",
    Completed: "status-completed",
  };

  const isBusy = actionId === task._id;
  const isCompleted = task.status === "Completed";

  return (
    <article className="task-card">
      <div className={`status-badge ${statusClassMap[task.status]}`}>
        {task.status}
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="task-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => onComplete(task)}
          disabled={isCompleted || isBusy}
        >
          {isBusy && !isCompleted ? "Updating..." : "Complete"}
        </button>
        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(task._id)}
          disabled={isBusy}
        >
          {isBusy ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
