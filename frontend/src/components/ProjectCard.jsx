import { Link } from "react-router-dom";

const BADGE_CLASS = {
  react: "sg-badge-react",
  "react.js": "sg-badge-react",
  "node.js": "sg-badge-node",
  node: "sg-badge-node",
  mongodb: "sg-badge-mongo",
  python: "sg-badge-python",
};

function badgeClass(tech) {
  if (typeof tech !== "string") return "sg-badge-default";
  return BADGE_CLASS[tech.toLowerCase()] || "sg-badge-default";
}

export default function ProjectCard({ project = {} }) {
  // Safe fallbacks for missing properties
  const title = project.name || project.title || "Untitled Project";
  const tagline = project.tagline || project.description || "";
  const rating = typeof project.rating === "number" ? project.rating.toFixed(1) : "0.0";
  const votes = project.votes || 0;

  // Safely normalize tech stack into an array
  let techList = [];
  if (Array.isArray(project.tech)) {
    techList = project.tech;
  } else if (typeof project.tech === "string") {
    try {
      const parsed = JSON.parse(project.tech);
      techList = Array.isArray(parsed) ? parsed : [project.tech];
    } catch {
      techList = project.tech.split(",").map((t) => t.trim());
    }
  }

  // Handle uploaded images vs fallback text header
  const rawImage = project.image || project.image_url;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `http://localhost:5000/${rawImage.replace(/^\/+/, "")}`
    : null;

  return (
    <Link to={`/projects/${project.id || project._id}`} className="text-decoration-none">
      <div className="sg-project-card">
        <div className="sg-project-thumb">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <h3>{title}</h3>
          )}
        </div>
        <div className="sg-project-body">
          <p className="desc mb-2">{tagline}</p>
          <div>
            {techList.slice(0, 3).map((t, index) => (
              <span key={index} className={`sg-badge ${badgeClass(t)}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="sg-meta">
            <span>
              <i className="bi bi-star-fill star me-1"></i>
              {rating}
            </span>
            <span>
              <i className="bi bi-eye me-1"></i>
              {votes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}