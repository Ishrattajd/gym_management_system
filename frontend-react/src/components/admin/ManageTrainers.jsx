
import React, { useEffect, useState } from "react";
import {
  fetchTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer
} from "../../services/api";

import "../../styles/AdminDashboard.css";
import "../../styles/Admin.css";

const ManageTrainers = () => {

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    is_active: true
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await fetchTrainers();
      setTrainers(data);
    } catch (error) {
      console.error("Failed to load trainers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      experience: "",
      is_active: true
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {
        await updateTrainer(editingId, formData);
      } else {
        await createTrainer(formData);
      }

      resetForm();
      setEditingId(null);
      setShowModal(false);
      loadTrainers();

    } catch (error) {

      console.error("Trainer save error:", error);
      alert("Failed to save trainer");

    }

  };

  const handleEdit = (trainer) => {

    setFormData({
      name: trainer.name,
      specialization: trainer.specialization,
      experience: trainer.experience,
      is_active: trainer.is_active
    });

    setEditingId(trainer.id);
    setShowModal(true);

  };

  const handleDelete = async (id) => {

    if (window.confirm("Delete this trainer?")) {

      try {

        await deleteTrainer(id);
        loadTrainers();

      } catch (error) {

        console.error("Delete error:", error);

      }

    }

  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (

    <div className="dashboard-wrapper">

      {/* SIDEBAR */}

      <div className="sidebar">

        <div className="mb-5">
          <h4 className="fw-bold mb-0 text-white">THE FITNESS TRIBE</h4>
          <small className="text-success">Admin Panel</small>
        </div>

        <nav className="flex-grow-1">

          <a href="/admin-dashboard" className="nav-item-custom">
            Dashboard
          </a>

          <a href="/admin/plans" className="nav-item-custom">
            Manage Plans
          </a>

          <a href="/admin/classes" className="nav-item-custom">
            Schedules
          </a>

          <a href="/admin/members" className="nav-item-custom">
            Members
          </a>

          <a href="/admin/bookings" className="nav-item-custom">
            Bookings
          </a>

          <a href="/admin/trainers" className="nav-item-custom active">
            Trainers
          </a>

        </nav>

        <div className="mt-auto border-top border-secondary pt-3">

          <div className="d-flex align-items-center mb-3">

            <div
              className="bg-success rounded-circle me-2"
              style={{
                width: 35,
                height: 35,
                display: "grid",
                placeItems: "center"
              }}
            >
              {username ? String(username).substring(0,2).toUpperCase() : "AU"}
            </div>

            <div>
              <p className="mb-0 small fw-bold">{username}</p>
              <p
                className="mb-0 smaller text-secondary"
                style={{ fontSize: "11px" }}
              >
                {email}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="text-danger text-decoration-none small"
            style={{ background: "none", border: "none" }}
          >
            Sign Out
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="main-content">

        <div className="admin-header">

          <div>
            <h2 className="fw-bold mb-1">TRAINERS</h2>
            <p className="text-secondary mb-4">
              Manage gym trainers
            </p>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setEditingId(null);
              setShowModal(true);
            }}
          >
            Add Trainer
          </button>

        </div>

        {/* TRAINERS GRID */}

        <div className="trainer-grid">

          {loading ? (

            <p>Loading trainers...</p>

          ) : trainers.length === 0 ? (

            <p>No trainers found</p>

          ) : (

            trainers.map((trainer) => (

              <div key={trainer.id} className="trainer-card">

                <h3 className="trainer-name">
                  {trainer.name}
                </h3>

                <p className="trainer-specialty">
                  {trainer.specialization}
                </p>

                <div className="trainer-info">

                  <span>
                    Experience: {trainer.experience} yrs
                  </span>

                </div>

                <div className="trainer-status">

                  <span
                    className={
                      trainer.is_active
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {trainer.is_active ? "Active" : "Inactive"}
                  </span>

                </div>

                <div className="trainer-actions">

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(trainer)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(trainer.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="plan-modal">

            <h3>
              {editingId ? "Edit Trainer" : "Add Trainer"}
            </h3>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Trainer Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                value={formData.experience}
                onChange={handleChange}
                required
              />

              <label style={{ marginTop: "10px" }}>
                Active Trainer
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={{ marginLeft: "10px" }}
                />
              </label>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default ManageTrainers;

