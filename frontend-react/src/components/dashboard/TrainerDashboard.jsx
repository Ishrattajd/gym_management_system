import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCircle,
  LogOut,
  Dumbbell,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";

const TrainerDashboard = () => {
  const username = localStorage.getItem("username") || "Trainer";
  const email = localStorage.getItem("email") || "trainer@email.com";
  const token = localStorage.getItem("access_token");

  const [classes, setClasses] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Fetch classes
      const classesRes = await fetch(
        "http://127.0.0.1:8000/api/classes/",
        { headers }
      );
      const classesData = await classesRes.json();

      const myClasses = classesData.filter(
        (c) => c.trainer_name === username
      );

      setClasses(myClasses);

      // Fetch members
      const membersRes = await fetch(
        "http://127.0.0.1:8000/api/members/",
        { headers }
      );

      const membersData = await membersRes.json();

      setTotalMembers(membersData.length);

    } catch (error) {
      console.error("Trainer dashboard error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initials = username.substring(0, 2).toUpperCase();

  return (
    <div className="container-fluid p-0 bg-dark-custom min-vh-100 d-flex">

      {/* Sidebar */}

      <aside className="sidebar d-flex flex-column justify-content-between p-4 bg-dark-custom">

        <div>

          <div className="d-flex align-items-center gap-2 mb-5">
            <Dumbbell className="text-success" size={32} />

            <div>
              <h4 className="text-white fw-bold m-0 tracking-tight">
                THE FIT TRIBE
              </h4>

              <small
                className="text-success fw-bold text-uppercase"
                style={{ fontSize: "10px" }}
              >
                Trainer Panel
              </small>
            </div>
          </div>

          <nav className="nav flex-column gap-2">

            <a href="trainer-dashboard" className="nav-link-custom active">
              <LayoutDashboard size={20} /> Dashboard
            </a>

            <a href="/trainer/classes" className="nav-link-custom">
              <CalendarDays size={20} /> My Classes
            </a>

             <a href="/trainer/bookings" className="nav-link-custom">
              <BookOpen size={20} /> Bookings
            </a>

            <a href="/trainer/members" className="nav-link-custom">
              <Users size={20} /> Members
            </a>

            <a href="/trainer/profile" className="nav-link-custom">
              <UserCircle size={20} /> Profile
            </a>

            <a href="/trainer/attendance" className="nav-link-custom">
              <ClipboardCheck size={20}/> Attendance
            </a>

          </nav>

        </div>

        <div className="pt-4 border-top border-secondary">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div className="avatar-circle">{initials}</div>

            <div>
              <p className="text-white fw-bold m-0 small">{username}</p>
              <p className="text-muted m-0" style={{ fontSize: "11px" }}>
                {email}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="btn btn-link p-0 text-danger text-decoration-none d-flex align-items-center gap-2 fw-bold small"
          >
            <LogOut size={18} /> Sign Out
          </button>

        </div>

      </aside>

      {/* Main */}

      <main className="main-content">

        <header className="mb-5">

          <h1 className="display-4 fw-black text-white text-uppercase">
            Welcome, {username}!
          </h1>

          <p className="text-muted fs-5">
            Trainer Dashboard
          </p>

        </header>


        {/* Stats */}

        <div className="row g-4 mb-5">

          <div className="col-md-6">

            <div className="card h-100 p-4 bg-card-custom stat-card-featured">

              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <CalendarDays size={18} className="text-success" />
                <span className="small fw-bold uppercase">My Classes</span>
              </div>

              <h2 className="text-white display-5 fw-bold m-0">
                {classes.length}
              </h2>

            </div>

          </div>


          <div className="col-md-6">

            <div className="card h-100 p-4 bg-card-custom border-gray-custom">

              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <Users size={18} />
                <span className="small fw-bold">Total Members</span>
              </div>

              <h2 className="text-white display-5 fw-bold m-0">
                {totalMembers}
              </h2>

            </div>

          </div>

        </div>


        {/* My Classes */}

        <div className="card p-4 bg-card-custom border-gray-custom">

          <h5 className="text-white text-uppercase fw-bold mb-4">
            My Classes
          </h5>

          <div className="d-flex flex-column gap-3">

            {classes.map((cls) => (
              <div
                key={cls.id}
                className="d-flex justify-content-between align-items-center p-4 rounded-3 bg-item-custom border-gray-custom"
              >

                <div>
                  <h5 className="text-white fw-bold mb-1">
                    {cls.class_type}
                  </h5>

                  <p className="text-muted small mb-0">
                    {cls.date} • {cls.time}
                  </p>
                </div>

                <div className="text-success fw-bold fs-5">
                  {cls.capacity} slots
                </div>

              </div>
            ))}

          </div>

        </div>

      </main>

    </div>
  );
};

export default TrainerDashboard;