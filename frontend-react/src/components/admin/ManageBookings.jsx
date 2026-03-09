import React, { useEffect, useState } from "react";
import {
  fetchBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  fetchSchedules,
} from "../../services/api";
import "../../styles/Admin.css";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    user: "",
    class_schedule: "",
    status: "confirmed",
  });

  const loadBookings = async () => {
    const data = await fetchBookings();
    setBookings(data);
  };

  const loadSchedules = async () => {
    const data = await fetchSchedules();
    setSchedules(data);
  };

  useEffect(() => {
    loadBookings();
    loadSchedules();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      user: "",
      class_schedule: "",
      status: "confirmed",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: parseInt(formData.user),
      class_schedule: parseInt(formData.class_schedule),
      status: formData.status,
    };

    try {
      if (editingId) {
        await updateBooking(editingId, payload);
      } else {
        await createBooking(payload);
      }

      resetForm();
      setEditingId(null);
      setShowModal(false);
      loadBookings();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to save booking");
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      user: booking.user,
      class_schedule: booking.class_schedule,
      status: booking.status,
    });

    setEditingId(booking.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this booking?")) {
      await deleteBooking(id);
      loadBookings();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Bookings</h2>
          <p className="admin-subtitle">Manage class bookings</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
        >
          Add Booking
        </button>
      </div>

      <div className="table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user_name}</td>

                <td>{b.class_name}</td>

                <td>
                  <span className="status-badge">{b.status}</span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="plan-modal">
            <h3>{editingId ? "Edit Booking" : "Create Booking"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="user"
                placeholder="User ID"
                value={formData.user}
                onChange={handleChange}
                required
              />

              <select
                name="class_schedule"
                value={formData.class_schedule}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>

                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.class_type} - {s.date}
                  </option>
                ))}
              </select>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>

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

export default ManageBookings;