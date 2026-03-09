import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import AdminDashboard from "./components/dashboard/AdminDashboard";
import ManageTrainers from "./components/admin/ManageTrainers";
import ManagePlans from "./components/admin/ManagePlans";
import Schedule from "./components/admin/Schedule";
import ManageBookings from "./components/admin/ManageBookings";
import Members from "./components/admin/Members";

import TrainerDashboard from "./components/dashboard/TrainerDashboard";
import MemberDashboard from "./components/dashboard/MemberDashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/trainers" element={<ManageTrainers />} />
        <Route path="/admin/plans" element={<ManagePlans />} />
        <Route path="/admin/classes" element={<Schedule />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/members" element={<Members />} />


        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;