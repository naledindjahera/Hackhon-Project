export default function Footer() {
  return (
    <footer className="py-4 mt-5" style={{ background: "#0a0e27", color: "#8b8fb8" }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>🚀 ShowCase Gallery — built for hackathon teams.</span>
        <span className="small">© {new Date().getFullYear()} ShowCase Gallery</span>
      </div>
    </footer>
  );
}
