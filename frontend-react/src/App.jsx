import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";

import AdminDashboard from "./components/dashboard/AdminDashboard";
import ManageTrainers from "./components/admin/ManageTrainers";
import ManagePlans from "./components/admin/ManagePlans";
import Schedule from "./components/admin/Schedule";
import ManageBookings from "./components/admin/ManageBookings";
import Members from "./components/admin/Members";

import TrainerDashboard from "./components/dashboard/TrainerDashboard";
import MyClasses from "./components/trainer/MyClasses";
import TrainerBookings from "./components/trainer/TrainerBookings";
import TrainerMembers from "./components/trainer/TrainerMembers";
import TrainerProfile from "./components/trainer/TrainerProfile";
import TrainerAttendance from "./components/trainer/TrainerAttendence";


import MemberDashboard from "./components/dashboard/MemberDashboard";
import MemberClasses from "./components/member/MemberClasses";
import MemberBookings from "./components/member/MemberBookings";
import MemberProfile from "./components/member/MemberProfile";
import MemberAIWorkout from "./components/member/MemberAIWorkout";
import MemberPlans from "./components/member/MemberPlans";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/trainers" element={<ManageTrainers />} />
        <Route path="/admin/plans" element={<ManagePlans />} />
        <Route path="/admin/classes" element={<Schedule />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/members" element={<Members />} />


        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/classes" element={<MyClasses />} />
        <Route path="/trainer/bookings" element={<TrainerBookings />} />
        <Route path="/trainer/members" element={<TrainerMembers />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        <Route path="/trainer/attendance" element={<TrainerAttendance />} />


        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/member/classes" element={<MemberClasses />} />
        <Route path="/member/bookings" element={<MemberBookings />} />
        <Route path="/member/profile" element={<MemberProfile />} />
        <Route path="/member/workouts" element={<MemberAIWorkout />} />
        <Route path="/member/plans" element={<MemberPlans />} />

      </Routes>
    </Router>
  );
}

export default App;