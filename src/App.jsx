import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import About from "./About";
import Contact from "./Contact";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;