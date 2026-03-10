import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// =======================
// AUTH
// =======================

export const loginUser = async (credentials) => {
  const res = await API.post("login/", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await API.post("register/", userData);
  return res.data;
};

// =======================
// TRAINERS
// =======================

export const fetchTrainers = async () => {
  const res = await API.get("trainers/");
  return res.data;
};

export const createTrainer = async (trainerData) => {
  const res = await API.post("trainers/", trainerData);
  return res.data;
};

export const updateTrainer = async (id, trainerData) => {
  const res = await API.put(`trainers/${id}/`, trainerData);
  return res.data;
};

export const deleteTrainer = async (id) => {
  const res = await API.delete(`trainers/${id}/`);
  return res.data;
};

// =======================
// PLANS
// =======================

export const fetchPlans = async () => {
  const res = await API.get("plans/");
  return res.data;
};

export const createPlan = async (planData) => {
  const res = await API.post("plans/", planData);
  return res.data;
};

export const updatePlan = async (id, planData) => {
  const res = await API.put(`plans/${id}/`, planData);
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await API.delete(`plans/${id}/`);
  return res.data;
};

// =======================
// SCHEDULES
// =======================

export const fetchSchedules = async () => {
  const res = await API.get("classes/");
  return res.data;
};

export const createSchedule = async (data) => {
  const res = await API.post("classes/", data);
  return res.data;
};

export const updateSchedule = async (id, data) => {
  const res = await API.put(`classes/${id}/`, data);
  return res.data;
};

export const deleteSchedule = async (id) => {
  await API.delete(`classes/${id}/`);
};

export const fetchBookings = async () => {
  const res = await API.get("bookings/");
  return res.data;
};

export const createBooking = async (data) => {
  const res = await API.post("bookings/", data);
  return res.data;
};

export const updateBooking = async (id, data) => {
  const res = await API.put(`bookings/${id}/`, data);
  return res.data;
};

export const deleteBooking = async (id) => {
  await API.delete(`bookings/${id}/`);
};

// =======================
// MEMBERS
// =======================

export const fetchMembers = async () => {
  const res = await API.get("members/");
  return res.data;
};

export const createMember = async (data) => {
  const res = await API.post("members/", data);
  return res.data;
};

export const updateMember = async (id, data) => {
  const res = await API.put(`members/${id}/`, data);
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await API.delete(`members/${id}/`);
  return res.data;
};





export default API;
