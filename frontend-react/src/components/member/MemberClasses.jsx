import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Dumbbell,
  LogOut,
  Clock,
  Users
} from "lucide-react";

const MemberClasses = () => {

  const username = localStorage.getItem("username") || "Member";
  const email = localStorage.getItem("email") || "member@email.com";
  const token = localStorage.getItem("access_token");

  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchBookings();
  }, []);

  const fetchClasses = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/classes/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setClasses(data);

    } catch (error) {
      console.error("Classes error:", error);
    }

  };

  const fetchBookings = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/bookings/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      // Only show bookings for current user
      const myBookings = data.filter(
        (b) => b.user_name === username
      );

      setBookings(myBookings);

    } catch (error) {
      console.error("Bookings error:", error);
    }

  };

  const bookClass = async (classId) => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/bookings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            class_schedule: classId,
            status: "confirmed"
          })
        }
      );

      if (res.ok) {

        alert("Class booked successfully!");

        fetchBookings();

      } else {

        const error = await res.json();
        console.log("Booking error:", error);

      }

    } catch (error) {
      console.error("Booking error:", error);
    }

  };

  const isBooked = (classId) => {

    return bookings.some(
      (b) => b.class_schedule === classId
    );

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

            <a href="/member-dashboard" className="nav-link-custom">
              <LayoutDashboard size={20}/> Dashboard
            </a>

            <a href="/member/classes" className="nav-link-custom active">
              <CalendarDays size={20}/> Classes
            </a>

            <a href="/member/bookings" className="nav-link-custom">
              <BookOpen size={20}/> My Bookings
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
            <LogOut size={18}/> Sign Out
          </button>

        </div>

      </aside>


      {/* Main Content */}

      <main className="main-content">

        <header className="mb-5">

          <h1 className="display-4 fw-black text-white text-uppercase">
            Class Schedule
          </h1>

          <p className="text-muted fs-5">
            Browse and book available classes
          </p>

        </header>


        {/* Classes Grid */}

        <div className="row g-4">

          {classes.map((cls) => {

            const booked = isBooked(cls.id);

            return (

              <div className="col-md-4" key={cls.id}>

                <div className="card p-4 bg-card-custom border-gray-custom h-100">

                  <span className="badge bg-success mb-3">
                    {cls.class_type}
                  </span>

                  <h4 className="text-white fw-bold">
                    {cls.class_type}
                  </h4>

                  <p className="text-muted small mb-3">
                    by {cls.trainer_name}
                  </p>

                  <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                    <Clock size={14}/> {cls.time}
                  </div>

                  <div className="text-muted small mb-3 d-flex align-items-center gap-2">
                    <Users size={14}/> Capacity {cls.capacity}
                  </div>

                  <button
                    disabled={booked}
                    onClick={() => bookClass(cls.id)}
                    className={`btn ${booked ? "btn-secondary" : "btn-success"} w-100`}
                  >

                    {booked ? "Already Booked" : "BOOK NOW"}

                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </main>

    </div>
  );
};

export default MemberClasses;