import React, { useEffect, useState } from "react";
import {
  fetchBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  fetchSchedules,
  fetchMembers,
} from "../../services/api";
import "../../styles/AdminDashboard.css";
import "../../styles/Admin.css";

const ManageBookings = () => {

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    user: "",
    class_schedule: "",
    status: "confirmed",
  });

  useEffect(() => {
    loadBookings();
    loadSchedules();
    loadMembers();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      const data = await fetchSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to load schedules", error);
    }
  };

  const loadMembers = async () => {
    try {
      const data = await fetchMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members", error);
    }
  };

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
      try {
        await deleteBooking(id);
        loadBookings();
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
          <a href="/admin-dashboard" className="nav-item-custom">Dashboard</a>
          <a href="/admin/plans" className="nav-item-custom">Manage Plans</a>
          <a href="/admin/classes" className="nav-item-custom">Schedules</a>
          <a href="/admin/members" className="nav-item-custom">Members</a>
          <a href="/admin/bookings" className="nav-item-custom active">Bookings</a>
          <a href="/admin/trainers" className="nav-item-custom">Manage Trainers</a>
        </nav>

        <div className="mt-auto border-top border-secondary pt-3">

          <div className="d-flex align-items-center mb-3">

            <div
              className="bg-success rounded-circle me-2"
              style={{ width: 35, height: 35, display: "grid", placeItems: "center" }}
            >
              {username ? username.substring(0, 2).toUpperCase() : "AU"}
            </div>

            <div>
              <p className="mb-0 small fw-bold">{username}</p>
              <p className="mb-0 smaller text-secondary" style={{ fontSize: "11px" }}>
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
            <h2 className="fw-bold mb-1">BOOKINGS</h2>
            <p className="text-secondary mb-4">Manage class bookings</p>
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

        {/* BOOKINGS TABLE */}
        <div className="table-container">
          <table className="schedule-table">

            <thead>
              <tr>
                <th>Member</th>
                <th>Class</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="4">No bookings found</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>

                    <td>{b.user_name}</td>
                    <td>{b.class_name}</td>

                    <td>
                      <span className={`status-badge ${b.status}`}>
                        {b.status}
                      </span>
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
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="plan-modal">

            <h3>{editingId ? "Edit Booking" : "Create Booking"}</h3>

            <form onSubmit={handleSubmit}>

              <select
                name="user"
                value={formData.user}
                onChange={handleChange}
                required
              >
                <option value="">Select Member</option>

                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.user_name || m.username}
                  </option>
                ))}
              </select>

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