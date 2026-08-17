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
  return BADGE_CLASS[tech.toLowerCase()] || "sg-badge-default";
}

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="text-decoration-none">
      <div className="sg-project-card">
        <div className="sg-project-thumb">
          <h3>{project.name}</h3>
        </div>
        <div className="sg-project-body">
          <p className="desc mb-2">{project.tagline}</p>
          <div>
            {project.tech.slice(0, 3).map((t) => (
              <span key={t} className={`sg-badge ${badgeClass(t)}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="sg-meta">
            <span>
              <i className="bi bi-star-fill star me-1"></i>
              {project.rating.toFixed(1)}
            </span>
            <span>
              <i className="bi bi-eye me-1"></i>
              {project.votes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
