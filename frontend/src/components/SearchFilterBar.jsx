const CATEGORIES = [
  "All",
  "Sustainability",
  "Education",
  "Health",
  "Finance",
  "Lifestyle",
];

const SORTS = [
  { value: "", label: "Featured" },
  { value: "rating", label: "Top Rated" },
  { value: "votes", label: "Most Voted" },
  { value: "new", label: "Newest" },
];

export default function SearchFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="row g-2 align-items-center mb-4">
      <div className="col-12 col-md-5">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="form-control border-start-0"
            placeholder="Search projects, teams, or tech..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search projects"
          />
        </div>
      </div>

      <div className="col-6 col-md-4">
        <select
          className="form-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c === "All" ? "" : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort projects"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
