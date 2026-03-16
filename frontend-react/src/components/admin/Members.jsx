
import React, { useState, useEffect } from "react";
import {
  fetchMembers,
  updateMember,
  deleteMember,
  fetchPlans
} from "../../services/api";

import "../../styles/AdminDashboard.css";
import "../../styles/Admin.css";

const Members = () => {

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    membership_plan: "",
    status: "Active"
  });

  useEffect(() => {
    loadMembers();
    loadPlans();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await fetchMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const data = await fetchPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load plans:", error);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleEdit = (member) => {

    setFormData({
      phone: member.phone || "",
      age: member.age || "",
      height: member.height || "",
      weight: member.weight || "",
      goal: member.goal || "",
      membership_plan: member.membership_plan || "",
      status: member.status || "Active"
    });

    setCurrentId(member.id);
    setShowModal(true);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateMember(currentId, formData);

      setShowModal(false);
      setCurrentId(null);

      loadMembers();

    } catch (error) {

      console.error("Error updating member:", error);
      alert("Failed to update member");

    }

  };

  const handleDelete = async (id) => {

    if (window.confirm("Delete this member?")) {

      try {

        await deleteMember(id);
        loadMembers();

      } catch (error) {

        console.error("Error deleting member:", error);
        alert("Delete failed");

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

          <a href="/admin/members" className="nav-item-custom active">
            Members
          </a>

          <a href="/admin/bookings" className="nav-item-custom">
            Bookings
          </a>

          <a href="/admin/trainers" className="nav-item-custom">
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
              {username ? username.substring(0,2).toUpperCase() : "AU"}
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
            <h2 className="fw-bold mb-1">MEMBERS</h2>
            <p className="text-secondary mb-4">
              Manage registered gym members
            </p>
          </div>

        </div>

        {loading ? (

          <p>Loading members...</p>

        ) : (

          <div className="table-container">

            <table className="schedule-table">

              <thead>

                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {members.length === 0 ? (

                  <tr>
                    <td colSpan="6">No members found</td>
                  </tr>

                ) : (

                  members.map((m) => (

                    <tr key={m.id}>

                      <td><strong>{m.username}</strong></td>

                      <td>{m.email}</td>

                      <td>{m.phone || "-"}</td>

                      <td>{m.plan_name || "No Plan"}</td>

                      <td>

                        <span
                          className={
                            m.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {m.status}
                        </span>

                      </td>

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(m)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(m.id)}
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

        )}

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="plan-modal">

            <h3>Edit Member</h3>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />

              <input
                type="number"
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleChange}
              />

              <input
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
              />

              <input
                type="text"
                name="goal"
                placeholder="Goal"
                value={formData.goal}
                onChange={handleChange}
              />

              <select
                name="membership_plan"
                value={formData.membership_plan}
                onChange={handleChange}
              >

                <option value="">Select Plan</option>

                {plans.map((plan) => (

                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>

                ))}

              </select>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>

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
                  Update
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default Members;
