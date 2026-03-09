import React, { useState, useEffect } from "react";
import {
  fetchMembers,
  updateMember,
  deleteMember,
  fetchPlans
} from "../../services/api";
import "../../styles/Admin.css";

const Members = () => {

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

  useEffect(() => {
    loadMembers();
    loadPlans();
  }, []);

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

  return (

    <div className="admin-page">

      <div className="admin-header">

        <div>
          <h2 className="admin-title">Members</h2>
          <p className="admin-subtitle">Manage registered gym members</p>
        </div>

      </div>

      {loading ? (

        <p className="text-light">Loading members...</p>

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

              {members.map((m) => (

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

              ))}

            </tbody>

          </table>

        </div>

      )}

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