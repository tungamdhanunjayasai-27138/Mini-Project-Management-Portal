function PaginationControls({ page, totalPages, total, onPageChange }) {
  return (
    <div className="pagination-bar">
      <p className="page-note">
        Page {page} of {totalPages} • {total} tasks
      </p>
      <div className="pagination-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
