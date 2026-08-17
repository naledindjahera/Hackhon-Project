import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container my-5 text-center sg-state">
      <h1 style={{ fontSize: "3rem" }}>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/" className="sg-btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
