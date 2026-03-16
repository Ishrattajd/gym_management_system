import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import "../../styles/trainer.css";

import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  Dumbbell,
  ClipboardCheck
} from "lucide-react";

const TrainerMembers = () => {

  const username = localStorage.getItem("username") || "Trainer";
  const email = localStorage.getItem("email") || "trainer@email.com";
  const token = localStorage.getItem("access_token");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = username.substring(0, 2).toUpperCase();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {

    try {

      if (!token) {
        console.error("Token missing");
        return;
      }

      const res = await fetch(
        "http://127.0.0.1:8000/api/members/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        console.error("Invalid members response:", data);
        setMembers([]);
      }

    } catch (error) {
      console.error("Members fetch error:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }

  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container-fluid p-0 bg-dark-custom min-vh-100 d-flex">

      {/* SIDEBAR */}

      <aside className="sidebar d-flex flex-column justify-content-between p-4 bg-dark-custom">

        <div>

          <div className="d-flex align-items-center gap-2 mb-5">

            <Dumbbell className="text-success" size={32} />

            <div>
              <h4 className="text-white fw-bold m-0">THE FIT TRIBE</h4>

              <small
                className="text-success fw-bold text-uppercase"
                style={{ fontSize: "10px" }}
              >
                Trainer Panel
              </small>

            </div>

          </div>

          <nav className="nav flex-column gap-2">

            <a href="/trainer-dashboard" className="nav-link-custom">
              <LayoutDashboard size={20}/> Dashboard
            </a>

            <a href="/trainer/classes" className="nav-link-custom">
              <CalendarDays size={20}/> My Classes
            </a>

            <a href="/trainer/bookings" className="nav-link-custom">
              <BookOpen size={20}/> Bookings
            </a>

            <a href="/trainer/members" className="nav-link-custom active">
              <Users size={20}/> Members
            </a>

            <a href="/trainer/profile" className="nav-link-custom">
              <UserCircle size={20}/> Profile
            </a>

            <a href="/trainer/attendance" className="nav-link-custom">
              <ClipboardCheck size={20}/> Attendance
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


      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="mb-5">

          <h1 className="display-4 fw-black text-white text-uppercase">
            Members
          </h1>

          <p className="text-light fs-5">
            Gym members overview
          </p>

        </header>


        <div className="card p-4 bg-card-custom border-gray-custom">

          <h5 className="text-white text-uppercase fw-bold mb-4">
            Member List
          </h5>

          {loading ? (

            <p className="text-light">Loading members...</p>

          ) : members.length === 0 ? (

            <p className="text-light">No members found.</p>

          ) : (

            <div className="d-flex flex-column gap-3">

              {members.map((m) => (

                <div
                  key={m.id}
                  className="d-flex justify-content-between align-items-center p-4 rounded-3 bg-item-custom border-gray-custom"
                >

                  <div>

                    <h5 className="text-white fw-bold mb-1">
                      {m.username || "Unknown"}
                    </h5>

                    <p className="text-white small mb-0">
                      Email: {m.email || "N/A"}
                    </p>

                    <p className="text-white small mb-0">
                      Goal: {m.goal || "Not specified"}
                    </p>

                  </div>

                  <div className="text-success fw-bold">

                    {m.plan_name || "No Plan"}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default TrainerMembers;