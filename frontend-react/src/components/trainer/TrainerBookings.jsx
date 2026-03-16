import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";

import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  Dumbbell,
  Trash2,
  CheckCircle,
  Clock,
  ClipboardCheck
} from "lucide-react";

const TrainerBookings = () => {

  const username = localStorage.getItem("username") || "Trainer";
  const email = localStorage.getItem("email") || "trainer@email.com";
  const token = localStorage.getItem("access_token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const initials = username.substring(0, 2).toUpperCase();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {

      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/bookings/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Invalid bookings response:", data);
        setBookings([]);
      }

    } catch (error) {
      console.error("Bookings error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {

    try {

      await fetch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      fetchBookings();

    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const deleteBooking = async (id) => {

    if (!window.confirm("Delete booking?")) return;

    try {

      await fetch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchBookings();

    } catch (error) {
      console.error("Delete error:", error);
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

            <a href="/trainer/bookings" className="nav-link-custom active">
              <BookOpen size={20}/> Bookings
            </a>

            <a href="/trainer/members" className="nav-link-custom">
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
            Class Bookings
          </h1>

          <p className="text-light fs-5">
            Manage member bookings
          </p>

        </header>


        <div className="card p-4 bg-card-custom border-gray-custom">

          <h5 className="text-white text-uppercase fw-bold mb-4">
            All Bookings
          </h5>

          {loading ? (

            <p className="text-light">Loading bookings...</p>

          ) : bookings.length === 0 ? (

            <p className="text-light">No bookings found.</p>

          ) : (

            <div className="d-flex flex-column gap-3">

              {bookings.map((b) => (

                <div
                  key={b.id}
                  className="d-flex justify-content-between align-items-center p-4 rounded-3 bg-item-custom border-gray-custom"
                >

                  <div>

                    <h5 className="text-white fw-bold mb-1">
                      {b.class_name}
                    </h5>

                    <p className="text-white small mb-1">
                      Member: {b.user_name}
                    </p>

                    <span className="badge bg-secondary">
                      {b.status}
                    </span>

                  </div>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(b.id, "Approved")}
                    >
                      <CheckCircle size={16}/>
                    </button>

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => updateStatus(b.id, "Pending")}
                    >
                      <Clock size={16}/>
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBooking(b.id)}
                    >
                      <Trash2 size={16}/>
                    </button>

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

export default TrainerBookings;