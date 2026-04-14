import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getAdminSummary = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/admin-summary`);
  return response.data;
};

export const getUserDashboard = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/user/${userId}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

// ANNOUNCEMENTS
export const createAnnouncement = async (announcementData) => {
  const response = await axios.post(`${API_BASE_URL}/announcements`, announcementData);
  return response.data;
};

export const getAnnouncements = async () => {
  const response = await axios.get(`${API_BASE_URL}/announcements`);
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/announcements/${id}`);
  return response.data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const response = await axios.put(`${API_BASE_URL}/announcements/${id}`, announcementData);
  return response.data;
};

// GOALS
export const createGoal = async (goalData) => {
  const response = await axios.post(`${API_BASE_URL}/goals`, goalData);
  return response.data;
};

export const getGoals = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals`);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/goals/${id}`);
  return response.data;
};

export const updateGoal = async (id, goalData) => {
  const response = await axios.put(`${API_BASE_URL}/goals/${id}`, goalData);
  return response.data;
};

// EVENTS
export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_BASE_URL}/events`, eventData);
  return response.data;
};

export const getEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_BASE_URL}/events/${id}`, eventData);
  return response.data;
};

// COMMISSIONS
export const createCommission = async (commissionData) => {
  const response = await axios.post(`${API_BASE_URL}/commissions`, commissionData);
  return response.data;
};

export const getCommissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/commissions`);
  return response.data;
};

export const deleteCommission = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/commissions/${id}`);
  return response.data;
};

export const updateCommission = async (id, commissionData) => {
  const response = await axios.put(`${API_BASE_URL}/commissions/${id}`, commissionData);
  return response.data;
};

// PROPERTIES
export const createProperty = async (propertyData) => {
  const response = await axios.post(`${API_BASE_URL}/properties`, propertyData);
  return response.data;
};

export const getProperties = async () => {
  const response = await axios.get(`${API_BASE_URL}/properties`);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/properties/${id}`);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await axios.put(`${API_BASE_URL}/properties/${id}`, propertyData);
  return response.data;
};