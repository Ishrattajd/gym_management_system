
import React, { useEffect, useState } from "react";
import "../../styles/trainer.css";
import "../../styles/TrainerDashboard.css";

const MyClasses = () => {

  const token = localStorage.getItem("access_token");

  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    class_type: "",
    date: "",
    time: "",
    duration: "",
    capacity: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  // =============================
  // FETCH CLASSES
  // =============================

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

  // =============================
  // HANDLE INPUT CHANGE
  // =============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =============================
  // ADD OR UPDATE CLASS
  // =============================

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
        console.log("Backend Error:", JSON.stringify(errorData, null, 2));
        alert(JSON.stringify(errorData));
        alert("Error saving class. Check console.");
        return;
      }

      setShowForm(false);
      setEditingId(null);

      setFormData({
        class_type: "",
        date: "",
        time: "",
        duration: "",
        capacity: ""
      });

      fetchClasses();

    } catch (error) {
      console.error("Error saving class", error);
    }
  };

  // =============================
  // EDIT CLASS
  // =============================

  const handleEdit = (cls) => {

    setEditingId(cls.id);
    setShowForm(true);

    setFormData({
      class_type: cls.class_type || "",
      date: cls.date || "",
      time: cls.time || "",
      duration: cls.duration || "",
      capacity: cls.capacity || ""
    });
  };

  // =============================
  // DELETE CLASS
  // =============================

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

  return (
    <div className="trainer-page">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">MY CLASSES</h2>
          <p className="page-sub">Manage your class schedule</p>
        </div>

        <button
          className="btn btn-success add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
        >
          ADD CLASS
        </button>
      </div>

      {/* ================= FORM ================= */}

      {showForm && (
        <div className="card form-card p-4 mb-4">

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

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
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
                placeholder="Duration"
                name="duration"
                value={formData.duration}
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

      {/* ================= CLASS CARDS ================= */}

      <div className="row g-4">

        {classes.map((cls) => (

          <div key={cls.id} className="col-md-6">

            <div className="class-card">

              <div className="d-flex justify-content-between">

                <span className="badge bg-success badge-class">
                  Strength
                </span>

                <span className="class-days">
                  {cls.days || ""}
                </span>

              </div>

              <h4 className="class-title">
                {cls.class_type}
              </h4>

              <p className="class-info">
                {cls.time} • {cls.duration} min
                &nbsp;&nbsp; 👥 {cls.enrolled || 0}/{cls.capacity}
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

    </div>
  );
};

export default MyClasses;

