import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Dumbbell,
  LogOut,
  Clock,
  Activity,
  ClipboardList,
  CreditCard
} from "lucide-react";

const MemberBookings = () => {

  const username = localStorage.getItem("username") || "Member";
  const email = localStorage.getItem("email") || "member@email.com";
  const token = localStorage.getItem("access_token");

  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Fetch classes
      const classRes = await fetch(
        "http://127.0.0.1:8000/api/classes/",
        { headers }
      );

      const classData = await classRes.json();

      if (Array.isArray(classData)) {
        setClasses(classData);
      } else {
        setClasses([]);
      }

      // Fetch bookings
      const bookingRes = await fetch(
        "http://127.0.0.1:8000/api/bookings/",
        { headers }
      );

      const bookingData = await bookingRes.json();

      if (Array.isArray(bookingData)) {

        const myBookings = bookingData.filter(
          (b) => b.user_name === username
        );

        setBookings(myBookings);

      } else {

        setBookings([]);

      }

    } catch (error) {
      console.error("Bookings error:", error);
    }

  };

  const getClassDetails = (classId) => {
    return classes.find((c) => c.id === classId);
  };

  const cancelBooking = async (id) => {

    if (!window.confirm("Cancel this booking?")) return;

    try {

      await fetch(
        `http://127.0.0.1:8000/api/bookings/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchData();

    } catch (error) {
      console.error("Cancel booking error:", error);
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

            <a href="/member/classes" className="nav-link-custom">
              <CalendarDays size={20}/> Classes
            </a>

            <a href="/member/bookings" className="nav-link-custom active">
              <BookOpen size={20}/> My Bookings
            </a>

            <a href="/member/workouts" className="nav-link-custom">
              <Activity size={20}/> AI Workout and diet
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
            My Bookings
          </h1>

          <p className="text-muted fs-5">
            Manage your booked classes
          </p>

        </header>

        <div className="card p-4 bg-card-custom border-gray-custom">

          <h5 className="text-white text-uppercase fw-bold mb-4">
            Booked Classes
          </h5>

          <div className="d-flex flex-column gap-3">

            {bookings.length === 0 && (
              <p className="text-muted">No bookings yet.</p>
            )}

            {bookings.map((booking) => {

              const classDetails = getClassDetails(booking.class_schedule);

              return (

                <div
                  key={booking.id}
                  className="d-flex justify-content-between align-items-center p-4 rounded-3 bg-item-custom border-gray-custom"
                >

                  <div>

                    <h5 className="text-white fw-bold mb-1">
                      {classDetails?.class_type || booking.class_name}
                    </h5>

                    <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                      <Clock size={14}/>
                      {classDetails?.date} • {classDetails?.time}
                    </p>

                  </div>

                  <div className="d-flex align-items-center gap-3">

                    <span className="badge bg-success">
                      {booking.status}
                    </span>

                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </main>

    </div>
  );
};

export default MemberBookings;