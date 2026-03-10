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
  Save
} from "lucide-react";

const TrainerProfile = () => {

  const username = localStorage.getItem("username") || "Trainer";
  const email = localStorage.getItem("email") || "trainer@email.com";
  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    phone: "",
    specialization: "",
    experience: "",
    bio: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/trainers/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.length > 0) {

        setProfile(data[0]);

        setForm({
          phone: data[0].phone || "",
          specialization: data[0].specialization || "",
          experience: data[0].experience || "",
          bio: data[0].bio || ""
        });

      }

    } catch (error) {
      console.error("Profile error:", error);
    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const updateProfile = async () => {

    try {

      await fetch(
        `http://127.0.0.1:8000/api/trainers/${profile.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...profile,
            ...form
          })
        }
      );

      alert("Profile Updated");
      fetchProfile();

    } catch (error) {
      console.error("Update error:", error);
    }

  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initials = username.substring(0, 2).toUpperCase();

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

            <a href="/trainer/members" className="nav-link-custom">
              <Users size={20}/> Members
            </a>

            <a href="/trainer/profile" className="nav-link-custom active">
              <UserCircle size={20}/> Profile
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
            Trainer Profile
          </h1>

          <p className="text-muted fs-5">
            Manage your trainer details
          </p>

        </header>


        <div className="card p-4 bg-card-custom border-gray-custom">

          <h5 className="text-white text-uppercase fw-bold mb-4">
            Profile Information
          </h5>

          <div className="row g-3">

            <div className="col-md-6">

              <label className="text-muted small mb-1">Phone</label>

              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-6">

              <label className="text-muted small mb-1">Specialization</label>

              <input
                className="form-control"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-6">

              <label className="text-muted small mb-1">Experience (Years)</label>

              <input
                className="form-control"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              />

            </div>

            <div className="col-md-12">

              <label className="text-muted small mb-1">Bio</label>

              <textarea
                className="form-control"
                rows="4"
                name="bio"
                value={form.bio}
                onChange={handleChange}
              />

            </div>

          </div>

          <button
            onClick={updateProfile}
            className="btn btn-success mt-4 d-flex align-items-center gap-2"
          >
            <Save size={18}/> Save Profile
          </button>

        </div>

      </main>

    </div>
  );
};

export default TrainerProfile;