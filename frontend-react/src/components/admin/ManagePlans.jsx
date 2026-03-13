
import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/plans/";

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  });

  // =========================
  // FETCH PLANS
  // =========================
  const fetchPlans = async () => {
    try {
      const res = await axios.get(API_URL);
      setPlans(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD PLAN
  // =========================
  const handleAddPlan = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, {
        name: formData.name,
        price: Number(formData.price),
        duration: Number(formData.duration),
        features: formData.features,
      });

      setFormData({
        name: "",
        price: "",
        duration: "",
        features: "",
      });

      setShowModal(false);
      fetchPlans();
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("Failed to add plan");
    }
  };

  // =========================
  // DELETE PLAN
  // =========================
  const deletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/plans/${planId}/`);
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan");
    }
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Membership Plans</h2>
          <p className="admin-subtitle">Manage gym membership plans</p>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Plan
        </button>
      </div>

      {/* PLANS GRID */}
      <div className="plans-grid">
        {loading ? (
          <p className="text-light">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-light">No plans found</p>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3 className="plan-name">{plan.name}</h3>

              <p className="plan-price">₹{plan.price}</p>

              <p className="plan-duration">{plan.duration} days</p>

              <p className="plan-features">{plan.features}</p>

              <button
                className="delete-btn"
                onClick={() => deletePlan(plan.id)}
              >
                Delete Plan
              </button>
            </div>
          ))
        )}
      </div>

      {/* ADD PLAN MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="plan-modal">
            <h3>Add Membership Plan</h3>

            <form onSubmit={handleAddPlan}>
              <input
                type="text"
                name="name"
                placeholder="Plan Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="duration"
                placeholder="Duration (days)"
                value={formData.duration}
                onChange={handleChange}
                required
              />

              <textarea
                name="features"
                placeholder="Features"
                value={formData.features}
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
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
