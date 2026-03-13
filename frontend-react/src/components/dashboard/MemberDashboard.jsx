import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import "../../styles/trainer.css";
import { CreditCard } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Dumbbell,
  LogOut,
  Activity,
  Target,
  ClipboardList
} from "lucide-react";

const MemberDashboard = () => {

  const username = localStorage.getItem("username") || "Member";
  const email = localStorage.getItem("email") || "member@email.com";
  const token = localStorage.getItem("access_token");

  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [memberProfile, setMemberProfile] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };

      const classesRes = await fetch(
        "http://127.0.0.1:8000/api/classes/",
        { headers }
      );
      const classesData = await classesRes.json();
      setClasses(classesData);

      const bookingsRes = await fetch(
        "http://127.0.0.1:8000/api/bookings/",
        { headers }
      );
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      const attendanceRes = await fetch(
        "http://127.0.0.1:8000/api/attendance/",
        { headers }
      );
      const attendanceData = await attendanceRes.json();
      setAttendance(attendanceData);

      const membersRes = await fetch(
        "http://127.0.0.1:8000/api/members/",
        { headers }
      );
      const membersData = await membersRes.json();

      // find logged in member
      const member = membersData.find(
        (m) => m.username === username
      );

      if (member) {
        setMemberProfile(member);
      }

    } catch (error) {
      console.error("Member dashboard error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initials = username.substring(0, 2).toUpperCase();

  const sessionsThisWeek = bookings.length;
  const upcomingClasses = classes.slice(0, 2);

  const recentAttendance = attendance
    .filter(a => a.user_name === username)
    .slice(0, 3);

  return (
    <div className="container-fluid p-0 bg-dark-custom min-vh-100 d-flex">

      {/* Sidebar */}

      <aside className="sidebar d-flex flex-column justify-content-between p-4 bg-dark-custom">

        <div>

          <div className="d-flex align-items-center gap-2 mb-5">
            <Dumbbell className="text-success" size={32} />

            <div>
              <h4 className="text-white fw-bold m-0">THE FITNESS TRIBE</h4>
              <small
                className="text-success fw-bold text-uppercase"
                style={{ fontSize: "10px" }}
              >
                Member Panel
              </small>
            </div>
          </div>

          <nav className="nav flex-column gap-2">

            <a href="/member-dashboard" className="nav-link-custom active">
              <LayoutDashboard size={20}/> Dashboard
            </a>

            <a href="/member/classes" className="nav-link-custom">
              <CalendarDays size={20}/> Classes
            </a>

            <a href="/member/bookings" className="nav-link-custom">
              <BookOpen size={20}/> My Bookings
            </a>

            <a href="/member/workouts" className="nav-link-custom">
              <Activity size={20}/> AI Workout
            </a>

            <a href="/member/profile" className="nav-link-custom">
              <ClipboardList size={20}/> Profile
            </a>

            <a href="/member/plans" className="nav-link-custom">
              <CreditCard size={20}/> Plans
            </a>

          </nav>

        </div>

        <div className="pt-4 border-top border-secondary">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div className="avatar-circle">
              {initials}
            </div>

            <div>
              <p className="text-white fw-bold m-0 small">
                {username}
              </p>

              <p className="text-muted m-0" style={{ fontSize: "11px" }}>
                {email}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="btn btn-link p-0 text-danger text-decoration-none d-flex align-items-center gap-2 fw-bold small"
          >
            <LogOut size={18}/> Sign Out
          </button>

        </div>

      </aside>

      {/* Main */}

      <main className="main-content">

        <header className="mb-5">

          <h1 className="display-4 fw-black text-white text-uppercase">
            Welcome Back, {username}!
          </h1>

          <p className="text-muted fs-5">
            Here's your fitness overview
          </p>

        </header>

        {/* Stats */}

        <div className="row g-4 mb-5">

          <div className="col-md-3">

            <div className="card h-100 p-4 bg-card-custom stat-card-featured">

              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <Activity size={18} className="text-success"/>
                <span className="small fw-bold uppercase">This Week</span>
              </div>

              <h3 className="text-white fw-bold m-0">
                {sessionsThisWeek} Sessions
              </h3>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card h-100 p-4 bg-card-custom border-gray-custom">

              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <CalendarDays size={18}/>
                <span className="small fw-bold">Upcoming</span>
              </div>

              <h3 className="text-white fw-bold m-0">
                {upcomingClasses.length} Classes
              </h3>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card h-100 p-4 bg-card-custom border-gray-custom">

              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <BookOpen size={18}/>
                <span className="small fw-bold">Plan</span>
              </div>

              <h3 className="text-white fw-bold m-0">
                {memberProfile?.plan_name || "None"}
              </h3>

            </div>

          </div>

          <div className="col-md-3">

            <div className="card h-100 p-4 bg-card-custom border-gray-custom">

              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <Target size={18}/>
                <span className="small fw-bold">Goal</span>
              </div>

              <h3 className="text-white fw-bold m-0">
                {memberProfile?.goal || "Not Set"}
              </h3>

            </div>

          </div>

        </div>

        {/* Lower Panels */}

        <div className="row g-4">

          {/* Upcoming Classes */}

          <div className="col-md-6">

            <div className="card p-4 bg-card-custom border-gray-custom">

              <h5 className="text-white text-uppercase fw-bold mb-4">
                Upcoming Classes
              </h5>

              <div className="d-flex flex-column gap-3">

                {upcomingClasses.map((cls) => (

                  <div
                    key={cls.id}
                    className="p-4 rounded-3 bg-item-custom border-gray-custom d-flex justify-content-between align-items-center"
                  >

                    <div>

                      <h5 className="text-white fw-bold mb-1">
                        {cls.class_type}
                      </h5>

                      <p className="text-muted small mb-0">
                        {cls.date}
                      </p>

                    </div>

                    <span className="badge bg-success">
                      confirmed
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* Attendance */}

          <div className="col-md-6">

            <div className="card p-4 bg-card-custom border-gray-custom">

              <h5 className="text-white text-uppercase fw-bold mb-4">
                Recent Attendance
              </h5>

              <div className="d-flex flex-column gap-3">

                {recentAttendance.map((att) => (

                  <div
                    key={att.id}
                    className="p-4 rounded-3 bg-item-custom border-gray-custom d-flex justify-content-between"
                  >

                    <div>

                      <h5 className="text-white fw-bold mb-1">
                        {att.date}
                      </h5>

                      <p className="text-muted small mb-0">
                        Status: {att.status}
                      </p>

                    </div>

                    <span
                      className={
                        att.status.toLowerCase() === "present"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                      }
                    >
                      {att.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default MemberDashboard;