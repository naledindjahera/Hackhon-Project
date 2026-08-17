import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../components/StateBlocks";
import { projectsApi } from "../api/api";
import { mockProjects } from "../data/mockProjects";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");
  const [myRating, setMyRating] = useState(0);
  const [voteState, setVoteState] = useState("idle"); // idle | submitting | done

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    projectsApi
      .get(id)
      .then((data) => {
        if (cancelled) return;
        setProject(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = mockProjects.find((p) => p.id === id);
        if (fallback) {
          setProject(fallback);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleVote(rating) {
    setMyRating(rating);
    setVoteState("submitting");
    try {
      const updated = await projectsApi.vote(id, rating);
      setProject(updated);
      setVoteState("done");
    } catch {
      // API might not be running (mock-data mode) — reflect it optimistically instead.
      setProject((prev) =>
        prev
          ? {
              ...prev,
              votes: prev.votes + 1,
              rating: Number((((prev.rating * prev.votes) + rating) / (prev.votes + 1)).toFixed(2)),
            }
          : prev
      );
      setVoteState("done");
    }
  }

  if (status === "loading") {
    return (
      <div className="container my-5">
        <div className="sg-skeleton" style={{ height: 340 }}></div>
      </div>
    );
  }

  if (status === "error" || !project) {
    return (
      <div className="container my-5">
        <ErrorState message="We couldn't find that project." />
        <div className="text-center">
          <Link to="/gallery" className="sg-btn-primary">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="container my-5">
      <Link to="/gallery" className="text-muted small d-inline-block mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Gallery
      </Link>

      <div className="row g-4">
        <div className="col-lg-8">
          <div
            className="rounded-4 mb-4"
            style={{
              height: 260,
              background: "linear-gradient(135deg,#6d28d9,#0a0e27)",
            }}
          ></div>

          <h1>{project.name}</h1>
          <p className="lead text-muted">{project.tagline}</p>

          <div className="mb-3">
            {project.tech.map((t) => (
              <span key={t} className="sg-badge sg-badge-default">
                {t}
              </span>
            ))}
          </div>

          <h5 className="mt-4">About this project</h5>
          <p>{project.description}</p>

          <div className="d-flex gap-3 mt-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="sg-btn-outline-light"
                style={{ color: "var(--sg-text-dark)", borderColor: "#ddd" }}
              >
                <i className="bi bi-github me-2"></i>
                GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="sg-btn-primary">
                <i className="bi bi-box-arrow-up-right me-2"></i>
                Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="sg-form-card">
            <h5>Project Stats</h5>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Team</span>
              <strong>{project.team}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Category</span>
              <strong>{project.category}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Rating</span>
              <strong>
                <i className="bi bi-star-fill star me-1"></i>
                {project.rating.toFixed(1)}
              </strong>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Votes</span>
              <strong>{project.votes}</strong>
            </div>

            <hr />

            <h6>Rate this project</h6>
            <div className="d-flex gap-1 mb-2" role="group" aria-label="Rate this project">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="btn btn-sm p-1"
                  onClick={() => handleVote(n)}
                  disabled={voteState === "submitting" || voteState === "done"}
                  aria-label={`Rate ${n} stars`}
                >
                  <i
                    className={`bi ${n <= myRating ? "bi-star-fill" : "bi-star"}`}
                    style={{ color: "var(--sg-star)", fontSize: "1.2rem" }}
                  ></i>
                </button>
              ))}
            </div>
            {voteState === "done" && (
              <p className="small text-success mb-0">
                <i className="bi bi-check-circle me-1"></i> Thanks for voting!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
