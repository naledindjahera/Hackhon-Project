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
  const [voteState, setVoteState] = useState("idle");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    projectsApi
      .get(id)
      .then((data) => {
        if (cancelled) return;
        const item = data?.project || data;
        setProject(item);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = mockProjects.find((p) => String(p.id) === String(id));
        if (fallback) {
          setProject({ ...fallback });
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

    // Helper function to calculate updated votes & average rating
    const calculateNewStats = (item) => {
      const currentVotes = Number(item.votes) || 0;
      const currentRating = Number(item.rating) || 0;
      const newVotes = currentVotes + 1;
      const newRating = Number(
        (((currentRating * currentVotes) + rating) / newVotes).toFixed(2)
      );
      return { votes: newVotes, rating: newRating };
    };

    // 1. Sync in-memory mockProjects array so Leaderboard & Gallery pick up the vote
    const mockIndex = mockProjects.findIndex((p) => String(p.id) === String(id));
    if (mockIndex !== -1) {
      const newStats = calculateNewStats(mockProjects[mockIndex]);
      mockProjects[mockIndex] = {
        ...mockProjects[mockIndex],
        ...newStats,
      };
    }

    try {
      const updated = await projectsApi.vote(id, rating);
      const payload = updated?.project || updated || {};

      // 2. Merge server API response into local state
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...payload,
          rating: typeof payload.rating === "number" ? payload.rating : prev.rating,
          votes: typeof payload.votes === "number" ? payload.votes : prev.votes,
          image: payload.image || payload.image_url || prev.image || prev.image_url,
          tech: payload.tech || prev.tech,
        };
      });
      setVoteState("done");
    } catch {
      // 3. Fallback optimistic update if backend API request fails
      setProject((prev) => {
        if (!prev) return prev;
        const newStats = calculateNewStats(prev);
        return {
          ...prev,
          ...newStats,
        };
      });
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
        <div className="text-center mt-3">
          <Link to="/gallery" className="sg-btn-primary">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  // Safe Property Extraction & Fallbacks
  const name = project.name || project.title || "Untitled Project";
  const tagline = project.tagline || "";
  const description = project.description || "No description provided.";
  const team = project.team || "Anonymous";
  const category = project.category || "General";
  const rating = typeof project.rating === "number" ? project.rating.toFixed(1) : "0.0";
  const votes = project.votes || 0;

  // Safe Tech Stack Normalization
  let techList = [];
  if (Array.isArray(project.tech)) {
    techList = project.tech;
  } else if (typeof project.tech === "string") {
    try {
      const parsed = JSON.parse(project.tech);
      techList = Array.isArray(parsed) ? parsed : [project.tech];
    } catch {
      techList = project.tech.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  // Image Normalization
  const rawImage = project.image || project.image_url;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `http://localhost:5000/${rawImage.replace(/^\/+/, "")}`
    : null;

  return (
    <section className="container my-5">
      <Link to="/gallery" className="text-muted small d-inline-block mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Gallery
      </Link>

      <div className="row g-4">
        <div className="col-lg-8">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="rounded-4 mb-4 w-100 object-fit-cover"
              style={{ maxHeight: 340 }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x400?text=Image+Unavailable";
              }}
            />
          ) : (
            <div
              className="rounded-4 mb-4 d-flex align-items-center justify-content-center text-white"
              style={{
                height: 260,
                background: "linear-gradient(135deg,#6d28d9,#0a0e27)",
              }}
            >
              <h2>{name}</h2>
            </div>
          )}

          <h1>{name}</h1>
          {tagline && <p className="lead text-muted">{tagline}</p>}

          <div className="mb-3">
            {techList.length > 0 ? (
              techList.map((t, index) => (
                <span key={index} className="sg-badge sg-badge-default me-1">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-muted small">No tech tags listed</span>
            )}
          </div>

          <h5 className="mt-4">About this project</h5>
          <p style={{ whiteSpace: "pre-line" }}>{description}</p>

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
              <strong>{team}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Category</span>
              <strong>{category}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Rating</span>
              <strong>
                <i className="bi bi-star-fill star me-1"></i>
                {rating}
              </strong>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Votes</span>
              <strong>{votes}</strong>
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
