import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import SearchFilterBar from "../components/SearchFilterBar";
import { LoadingGrid, EmptyState, ErrorState } from "../components/StateBlocks";
import { projectsApi } from "../api/api";
import { mockProjects } from "../data/mockProjects";

export default function Gallery() {
  const [allProjects, setAllProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    projectsApi
      .list()
      .then((data) => {
        if (cancelled) return;
        setAllProjects(data.projects || []);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setAllProjects(mockProjects);
        setStatus("ready");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = allProjects
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q))
      );
    })
    .filter((p) => !category || p.category === category)
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "votes") return b.votes - a.votes;
      if (sort === "new") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <section className="container my-5">
      <div className="mb-4">
        <h1 className="sg-section-title">🖼️ Project Gallery</h1>
        <p className="text-muted">Browse every project the community has shared.</p>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      {status === "loading" && <LoadingGrid count={9} />}

      {status === "error" && (
        <ErrorState
          message="Couldn't load the gallery. Check that the API server is running."
          onRetry={() => window.location.reload()}
        />
      )}

      {status === "ready" && filtered.length === 0 && (
        <EmptyState
          title="No projects match your search"
          message="Try a different keyword, or clear your filters."
        />
      )}

      {status === "ready" && filtered.length > 0 && (
        <>
          <p className="text-muted small">{filtered.length} project{filtered.length !== 1 && "s"} found</p>
          <div className="row g-4">
            {filtered.map((p) => (
              <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="sg-cta-panel mt-5">
        <h4>Have an amazing project?</h4>
        <p className="text-muted mb-3">Share your innovation with the world.</p>
        <Link to="/submit" className="sg-btn-primary">
          Submit Your Project
        </Link>
      </div>
    </section>
  );
}
