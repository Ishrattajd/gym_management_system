import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import {
  fetchTrainers,
  createTrainer,
  deleteTrainer
} from "../../services/api";

const ManageTrainers = () => {

  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    rating: "",
    active: true
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  useEffect(() => {
    const filtered = trainers.filter((t) =>
      t.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTrainers(filtered);
  }, [search, trainers]);

  const loadTrainers = async () => {
    try {
      const data = await fetchTrainers();

      if (Array.isArray(data)) {
        setTrainers(data);
        setFilteredTrainers(data);
      } else if (Array.isArray(data.results)) {
        setTrainers(data.results);
        setFilteredTrainers(data.results);
      } else {
        setTrainers([]);
        setFilteredTrainers([]);
      }

    } catch (error) {
      console.error("Failed to load trainers:", error);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();

    try {
      await createTrainer(formData);

      setShowModal(false);

      setFormData({
        name: "",
        specialization: "",
        experience: "",
        rating: "",
        active: true
      });

      loadTrainers();

    } catch (error) {
      console.error("Error adding trainer:", error);
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm("Delete this trainer?")) return;

    try {
      await deleteTrainer(id);
      loadTrainers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <h2 className="admin-title">Trainers</h2>
          <p className="admin-subtitle">
            Manage all gym trainers
          </p>
        </div>

        <div className="header-actions">

          <input
            type="text"
            placeholder="Search trainer..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Trainer
          </button>

        </div>

      </div>

      {/* TRAINERS GRID */}

      <div className="trainer-grid">

        {loading ? (
          <p className="text-light">Loading trainers...</p>
        ) : filteredTrainers.length === 0 ? (
          <p className="text-light">No trainers found</p>
        ) : (
          filteredTrainers.map((trainer) => (

            <div key={trainer.id} className="trainer-card">

              <div className="trainer-avatar">
                {trainer.name?.substring(0,2).toUpperCase()}
              </div>

              <h4 className="trainer-name">
                {trainer.name}
              </h4>

              <p className="trainer-specialty">
                {trainer.specialization}
              </p>

              <div className="trainer-info">
                <span>{trainer.experience} yrs</span>
                <span className="rating">
                  ★ {trainer.rating}
                </span>
              </div>

              <div className="trainer-status">
                <span className={
                  trainer.active
                    ? "status-active"
                    : "status-inactive"
                }>
                  {trainer.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="trainer-actions">

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteTrainer(trainer.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

      {/* ADD TRAINER MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="trainer-modal">

            <h3>Add Trainer</h3>

            <form onSubmit={handleAddTrainer}>

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

              <input
                type="number"
                step="0.1"
                name="rating"
                placeholder="Rating"
                value={formData.rating}
                onChange={handleChange}
                required
              />

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save Trainer
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