import React, { useState, useEffect } from "react";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  fetchTrainers,
} from "../../services/api";
import "../../styles/Admin.css";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    trainer: "",
    class_type: "",
    date: "",
    time: "",
    capacity: "",
  });

  // Load schedules
  const loadSchedules = async () => {
    try {
      const data = await fetchSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Load trainers
  const loadTrainers = async () => {
    try {
      const data = await fetchTrainers();
      setTrainers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load trainers:", error);
    }
  };

  useEffect(() => {
    loadSchedules();
    loadTrainers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      trainer: "",
      class_type: "",
      date: "",
      time: "",
      capacity: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.trainer) {
      alert("Please select a trainer");
      return;
    }

    const payload = {
      trainer: parseInt(formData.trainer),
      class_type: formData.class_type,
      date: formData.date,
      time: formData.time,
      capacity: parseInt(formData.capacity),
    };

    try {
      if (isEditing) {
        await updateSchedule(currentId, payload);
      } else {
        await createSchedule(payload);
      }

      setShowModal(false);
      setIsEditing(false);
      setCurrentId(null);
      resetForm();

      loadSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error.response?.data || error);
      alert("Failed to save schedule");
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      trainer: schedule.trainer,
      class_type: schedule.class_type,
      date: schedule.date,
      time: schedule.time,
      capacity: schedule.capacity,
    });

    setCurrentId(schedule.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this schedule?")) {
      try {
        await deleteSchedule(id);
        loadSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert("Failed to delete schedule");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Class Schedules</h2>
          <p className="admin-subtitle">Manage all gym classes</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
          }}
        >
          Create Schedule
        </button>
      </div>

      {loading ? (
        <p className="text-light">Loading schedules...</p>
      ) : (
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Trainer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((s) => {
                const trainerName =
                  s.trainer_name ||
                  trainers.find((t) => t.id === s.trainer)?.name ||
                  "Unknown";

                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.class_type}</strong>
                    </td>

                    <td>{trainerName}</td>

                    <td>
                      {s.date
                        ? new Date(s.date).toLocaleDateString()
                        : "No Date"}
                    </td>

                    <td>{s.time}</td>

                    <td>{s.capacity}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="plan-modal">
            <h3>{isEditing ? "Edit Schedule" : "Create Schedule"}</h3>

            <form onSubmit={handleSubmit}>
              <select
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                required
              >
                <option value="">Select Trainer</option>

                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="class_type"
                placeholder="Class Type (Yoga, Cardio...)"
                value={formData.class_type}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={formData.capacity}
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

                <button type="submit" className="save-btn">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;