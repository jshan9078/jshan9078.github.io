import { useLayoutEffect } from "react";
import Nav from "./components/Nav";
import SinglePage from "./pages/SinglePage";
import ProjectDetail from "./pages/ProjectDetail";
import AgentsPage from "./pages/AgentsPage";
import AgentBlogPost from "./pages/AgentBlogPost";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

function ScrollManager() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function AppContent() {
  return (
    <div className="main">
      <Nav />
      <Routes>
        <Route path="/" element={<SinglePage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agents/:slug" element={<AgentBlogPost />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AppContent />
    </BrowserRouter>
  );
}
