function FilterBar({
  filterValue,
  onFilterChange,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
}) {
  return (
    <div className="filter-bar">
      <div className="control-group control-search">
        <label htmlFor="taskSearch">Search tasks</label>
        <input
          id="taskSearch"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search title or description"
        />
      </div>
      <div className="control-group">
        <label htmlFor="statusFilter">Filter by status</label>
        <select
          id="statusFilter"
          value={filterValue}
          onChange={(event) => onFilterChange(event.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="control-group">
        <label htmlFor="sortOrder">Sort by date</label>
        <select
          id="sortOrder"
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
