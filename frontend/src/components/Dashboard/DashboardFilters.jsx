const DashboardFilters = ({
  searchTerm,
  setSearchTerm,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  filterDueDate,
  setFilterDueDate,
  filterTag,           
  setFilterTag,        
  allTags = ['all'],             
  sortBy,
  setSortBy,
  clearFilters,
  hasActiveFilters,
  getStatusCount,
  filteredTasksCount,
}) => {
  return (
    <div className="mt-6 mb-8">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <label
            className="block text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: "#131214", opacity: 0.6 }}
          >
            search
          </label>
          <div className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="find tasks... (⌘F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border-2 bg-white transition-all duration-200"
              style={{ borderColor: "#131214" }}
              onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
              onBlur={(e) => (e.target.style.borderColor = "#131214")}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono"
                style={{ color: "#131214", opacity: 0.4 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="min-w-[150px]">
          <label
            className="block text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: "#131214", opacity: 0.6 }}
          >
            priority
          </label>
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer"
              style={{ borderColor: "#131214" }}
              onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
              onBlur={(e) => (e.target.style.borderColor = "#131214")}
            >
              <option value="all">all priorities</option>
              <option value="low">♪ low</option>
              <option value="medium">♫ medium</option>
              <option value="high">♬ high</option>
            </select>
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#131214", opacity: 0.4 }}
            >
              ▼
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="min-w-[150px]">
          <label
            className="block text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: "#131214", opacity: 0.6 }}
          >
            status
          </label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer"
              style={{ borderColor: "#131214" }}
              onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
              onBlur={(e) => (e.target.style.borderColor = "#131214")}
            >
              <option value="all">all statuses</option>
              <option value="todo">to do ({getStatusCount("todo")})</option>
              <option value="inprogress">
                in progress ({getStatusCount("inprogress")})
              </option>
              <option value="done">done ({getStatusCount("done")})</option>
            </select>
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#131214", opacity: 0.4 }}
            >
              ▼
            </div>
          </div>
        </div>

        {/* Due Date Filter */}
        <div className="min-w-[150px]">
          <label
            className="block text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: "#131214", opacity: 0.6 }}
          >
            due date
          </label>
          <div className="relative">
            <select
              value={filterDueDate}
              onChange={(e) => setFilterDueDate(e.target.value)}
              className="w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer"
              style={{ borderColor: "#131214" }}
              onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
              onBlur={(e) => (e.target.style.borderColor = "#131214")}
            >
              <option value="all">all dates</option>
              <option value="today">📌 today</option>
              <option value="tomorrow">📌 tomorrow</option>
              <option value="this-week">📅 this week</option>
              <option value="overdue">⚠️ overdue</option>
              <option value="no-date">📭 no date</option>
            </select>
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#131214", opacity: 0.4 }}
            >
              ▼
            </div>
          </div>
        </div>

        {/* 🆕 Tag Filter */}
        <div className="min-w-[150px]">
          <label
            className="block text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: "#131214", opacity: 0.6 }}
          >
            tag
          </label>
          <div className="relative">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer"
              style={{ borderColor: "#131214" }}
              onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
              onBlur={(e) => (e.target.style.borderColor = "#131214")}
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === "all" ? "all tags" : `#${tag}`}
                </option>
              ))}
            </select>
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#131214", opacity: 0.4 }}
            >
              ▼
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="min-w-[150px]">
          <label
            className="block text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: "#131214", opacity: 0.6 }}
          >
            sort by
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 border-2 bg-white appearance-none transition-all duration-200 cursor-pointer"
              style={{ borderColor: "#131214" }}
              onFocus={(e) => (e.target.style.borderColor = "#F7B7DA")}
              onBlur={(e) => (e.target.style.borderColor = "#131214")}
            >
              <option value="position">default</option>
              <option value="due-date">📅 due date (earliest)</option>
              <option value="due-date-desc">📅 due date (latest)</option>
              <option value="priority">⭐ priority</option>
              <option value="title">🔤 title</option>
            </select>
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#131214", opacity: 0.4 }}
            >
              ▼
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 border-2 transition-all duration-200 hover:translate-x-0.5 font-medium"
            style={{ borderColor: "#131214", backgroundColor: "#FAF4E3" }}
          >
            ✕ clear all
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {searchTerm && (
            <span
              className="text-xs px-3 py-1 border flex items-center gap-1"
              style={{ borderColor: "#131214" }}
            >
              <span>🔍</span> {searchTerm}
            </span>
          )}
          {filterPriority !== "all" && (
            <span
              className="text-xs px-3 py-1 border flex items-center gap-1"
              style={{ borderColor: "#131214" }}
            >
              <span
                className={
                  filterPriority === "high"
                    ? "text-pink-400"
                    : filterPriority === "medium"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }
              >
                {filterPriority === "high"
                  ? "♬"
                  : filterPriority === "medium"
                  ? "♫"
                  : "♪"}
              </span>
              {filterPriority}
            </span>
          )}
          {filterStatus !== "all" && (
            <span
              className="text-xs px-3 py-1 border flex items-center gap-1"
              style={{ borderColor: "#131214" }}
            >
              <span>
                {filterStatus === "todo"
                  ? "○"
                  : filterStatus === "inprogress"
                  ? "◔"
                  : "✓"}
              </span>
              {filterStatus}
            </span>
          )}
          {filterDueDate !== "all" && (
            <span
              className="text-xs px-3 py-1 border flex items-center gap-1"
              style={{ borderColor: "#131214" }}
            >
              📅 {filterDueDate.replace("-", " ")}
            </span>
          )}
          {filterTag !== "all" && (
            <span
              className="text-xs px-3 py-1 border flex items-center gap-1"
              style={{ borderColor: "#131214" }}
            >
              # {filterTag}
            </span>
          )}
          {sortBy !== "position" && (
            <span
              className="text-xs px-3 py-1 border flex items-center gap-1"
              style={{ borderColor: "#131214" }}
            >
              ↕ {sortBy.replace("-", " ")}
            </span>
          )}
          <span
            className="text-xs px-3 py-1"
            style={{ color: "#131214", opacity: 0.5 }}
          >
            {filteredTasksCount} task{filteredTasksCount !== 1 ? "s" : ""} found
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;