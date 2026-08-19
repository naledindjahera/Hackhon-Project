import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import ProjectDetails from "./pages/ProjectDetails";
import SubmitProject from "./pages/SubmitProject";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

export default function App() {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Default URL redirects to /login if not authenticated */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
          />
          <Route path="/home" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}