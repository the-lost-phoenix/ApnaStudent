import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import StudentProfile from './pages/StudentProfile';
import Register from './pages/Register'; // Import this
import Login from './pages/Login';       // Import this
import Dashboard from './pages/Dashboard'; // Import this
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Dynamic User Profile Route - specific routes must come FIRST to avoid collision */}
        {/* e.g. /dashboard or /login are handled above. anything else will be treated as username? 
            actually react-router matches exact paths first usually if ordered well.
            /:username acts as a catch-all if placed last. */}
        <Route path="/:username" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}

export default App;