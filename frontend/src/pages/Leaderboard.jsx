import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingGrid, ErrorState } from "../components/StateBlocks";
import { projectsApi } from "../api/api";
import { mockProjects } from "../data/mockProjects";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");

  function load() {
    setStatus("loading");
    projectsApi
      .list({ sort: "votes" })
      .then((data) => {
        setProjects(data.projects || []);
        setStatus("ready");
      })
      .catch(() => {
        setProjects([...mockProjects].sort((a, b) => b.votes - a.votes));
        setStatus("ready");
      });
  }

  useEffect(() => {
    load();
    // Poll periodically so the leaderboard feels "live" during judging.
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container my-5">
      <h1 className="sg-section-title mb-1">🏆 Live Leaderboard</h1>
      <p className="text-muted mb-4">Ranked by community votes — updates automatically.</p>

      {status === "loading" && <LoadingGrid count={5} />}
      {status === "error" && <ErrorState message="Couldn't load the leaderboard." onRetry={load} />}

      {status === "ready" && (
        <div className="sg-form-card p-0 overflow-hidden">
          {projects.map((p, i) => (
            <Link
              to={`/projects/${p.id}`}
              key={p.id}
              className="d-flex align-items-center justify-content-between px-4 py-3 text-decoration-none"
              style={{
                borderBottom: i < projects.length - 1 ? "1px solid #eee" : "none",
                color: "var(--sg-text-dark)",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <span style={{ width: 32, fontSize: "1.2rem" }}>
                  {MEDAL[i] || `#${i + 1}`}
                </span>
                <div>
                  <div className="fw-semibold">{p.name}</div>
                  <div className="text-muted small">{p.team}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">
                  <i className="bi bi-star-fill star me-1"></i>
                  {p.rating.toFixed(1)}
                </span>
                <span className="fw-bold" style={{ color: "var(--sg-violet-600)" }}>
                  {p.votes} votes
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
