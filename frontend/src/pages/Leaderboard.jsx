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
        // Safe extraction whether backend returns array or { projects: [...] }
        const rawList = Array.isArray(data)
          ? data
          : data?.projects || data?.items || [];

        // Client-side vote sort fallback to guarantee accurate rank ordering
        const sorted = [...rawList].sort((a, b) => {
          const votesA = Number(a?.votes) || 0;
          const votesB = Number(b?.votes) || 0;
          if (votesB !== votesA) return votesB - votesA;

          const ratingA = Number(a?.rating) || 0;
          const ratingB = Number(b?.rating) || 0;
          return ratingB - ratingA;
        });

        setProjects(sorted);
        setStatus("ready");
      })
      .catch(() => {
        const sortedMock = [...mockProjects].sort(
          (a, b) => (b.votes || 0) - (a.votes || 0)
        );
        setProjects(sortedMock);
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
      {status === "error" && (
        <ErrorState message="Couldn't load the leaderboard." onRetry={load} />
      )}

      {status === "ready" && projects.length === 0 && (
        <p className="text-muted text-center py-5">No projects found to display in leaderboard.</p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="sg-form-card p-0 overflow-hidden">
          {projects.map((p, i) => {
            const name = p.name || p.title || "Untitled Project";
            const team = p.team || "Anonymous";
            const votes = p.votes || 0;
            const rating = typeof p.rating === "number" ? p.rating.toFixed(1) : "0.0";

            return (
              <Link
                to={`/projects/${p.id}`}
                key={p.id || i}
                className="d-flex align-items-center justify-content-between px-4 py-3 text-decoration-none"
                style={{
                  borderBottom: i < projects.length - 1 ? "1px solid #eee" : "none",
                  color: "var(--sg-text-dark)",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ width: 32, fontSize: "1.2rem", fontWeight: "bold" }}>
                    {MEDAL[i] || `#${i + 1}`}
                  </span>
                  <div>
                    <div className="fw-semibold">{name}</div>
                    <div className="text-muted small">{team}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small">
                    <i className="bi bi-star-fill star me-1"></i>
                    {rating}
                  </span>
                  <span className="fw-bold" style={{ color: "var(--sg-violet-600)" }}>
                    {votes} {votes === 1 ? "vote" : "votes"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}