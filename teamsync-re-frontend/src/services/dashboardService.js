import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const handleError = (error, context) => {
  const message = error.response?.data?.message || error.message || "Unknown error occurred";
  console.error(`${context}:`, message, error);
  throw error;
};

export const getAdminSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/admin-summary`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch admin summary");
  }
};

export const getUserDashboard = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/user/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch user dashboard");
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch users");
  }
};

// ANNOUNCEMENTS
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/announcements`, announcementData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create announcement");
  }
};

export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/announcements`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch announcements");
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/announcements/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete announcement");
  }
};

export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/announcements/${id}`, announcementData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update announcement");
  }
};

// GOALS
export const createGoal = async (goalData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/goals`, goalData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create goal");
  }
};

export const getGoals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/goals`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch goals");
  }
};

export const deleteGoal = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/goals/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete goal");
  }
};

export const updateGoal = async (id, goalData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/goals/${id}`, goalData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update goal");
  }
};

// EVENTS
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create event");
  }
};

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch events");
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete event");
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update event");
  }
};

// COMMISSIONS
export const createCommission = async (commissionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/commissions`, commissionData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create commission");
  }
};

export const getCommissions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/commissions`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch commissions");
  }
};

export const deleteCommission = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/commissions/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete commission");
  }
};

export const updateCommission = async (id, commissionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/commissions/${id}`, commissionData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update commission");
  }
};

// PROPERTIES
export const createProperty = async (propertyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create property");
  }
};

export const getProperties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch properties");
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/properties/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete property");
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update property");
  }
};
// USERS
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create user");
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update user");
  }
};

export const deactivateUser = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}/deactivate`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to deactivate user");
  }
};

export const reactivateUser = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}/reactivate`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to reactivate user");
  }
};