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
  BookOpen
} from "lucide-react";

const MyClasses = () => {

  const username = localStorage.getItem("username") || "Trainer";
  const email = localStorage.getItem("email") || "trainer@email.com";
  const token = localStorage.getItem("access_token");

  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    class_type: "",
    date: "",
    time: "",
    capacity: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  // FETCH CLASSES

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/classes/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setClasses(data);

    } catch (error) {
      console.error("Error loading classes", error);
    }
  };

  // INPUT CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ADD / UPDATE CLASS

  const handleSubmit = async () => {

    const url = editingId
      ? `http://127.0.0.1:8000/api/classes/${editingId}/`
      : "http://127.0.0.1:8000/api/classes/";

    const method = editingId ? "PUT" : "POST";

    try {

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Backend Error:", errorData);
        alert("Error saving class");
        return;
      }

      setShowForm(false);
      setEditingId(null);

      setFormData({
        class_type: "",
        date: "",
        time: "",
        capacity: ""
      });

      fetchClasses();

    } catch (error) {
      console.error("Error saving class", error);
    }
  };

  // EDIT

  const handleEdit = (cls) => {

    setEditingId(cls.id);
    setShowForm(true);

    setFormData({
      class_type: cls.class_type || "",
      date: cls.date || "",
      time: cls.time || "",
      capacity: cls.capacity || ""
    });
  };

  // DELETE

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this class?")) return;

    try {

      await fetch(`http://127.0.0.1:8000/api/classes/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchClasses();

    } catch (error) {
      console.error("Delete error", error);
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
              <h4 className="text-white fw-bold m-0">
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

            <a href="/trainer-dashboard" className="nav-link-custom">
              <LayoutDashboard size={20} /> Dashboard
            </a>

            <a href="/trainer/classes" className="nav-link-custom active">
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


      {/* MAIN CONTENT */}

      <main className="main-content">

        <div className="d-flex justify-content-between align-items-center mb-5">

          <div>
            <h1 className="display-5 fw-bold text-white">
              My Classes
            </h1>
            <p className="text-muted">
              Manage your gym classes
            </p>
          </div>

          <button
            className="btn btn-success"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
          >
            Add Class
          </button>

        </div>


        {/* FORM */}

        {showForm && (
          <div className="card p-4 bg-card-custom border-gray-custom mb-5">

            <div className="row g-3">

              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Class Type"
                  name="class_type"
                  value={formData.class_type}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-1">
                <button
                  className="btn btn-success w-100"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>

            </div>

          </div>
        )}


        {/* CLASS CARDS */}

        <div className="row g-4">

          {classes.map((cls) => (

            <div key={cls.id} className="col-md-6">

              <div className="card p-4 bg-card-custom border-gray-custom">

                <div className="d-flex justify-content-between mb-3">

                  <span className="badge bg-success">
                    {cls.class_type}
                  </span>

                </div>

                <h4 className="text-white fw-bold">
                  {cls.class_type}
                </h4>

                <p className="text-muted small">
                  📅 {cls.date} • ⏰ {cls.time}
                </p>

                <p className="text-success fw-bold">
                  {cls.capacity} slots
                </p>

                <div className="d-flex gap-2 mt-3">

                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => handleEdit(cls)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(cls.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
};

export default MyClasses;