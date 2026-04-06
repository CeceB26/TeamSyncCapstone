import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dashboard";
const USERS_URL = "http://localhost:8080/api/users";
const ANNOUNCEMENTS_URL = "http://localhost:8080/api/announcements";
const PROPERTIES_URL = "http://localhost:8080/api/properties";

export const createProperty = async (propertyData) => {
  const response = await axios.post(PROPERTIES_URL, propertyData);
  return response.data;
};

export const getProperties = async () => {
  const response = await axios.get(PROPERTIES_URL);
  return response.data;
};

export const getAdminSummary = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin-summary`);
  return response.data;
};

export const getUserDashboard = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await axios.post(ANNOUNCEMENTS_URL, announcementData);
  return response.data;
};
const GOALS_URL = "http://localhost:8080/api/goals";

export const createGoal = async (goalData) => {
  const response = await axios.post(GOALS_URL, goalData);
  return response.data;
};
const EVENTS_URL = "http://localhost:8080/api/events";

export const createEvent = async (eventData) => {
  const response = await axios.post(EVENTS_URL, eventData);
  return response.data;
};
const COMMISSIONS_URL = "http://localhost:8080/api/commissions";

export const createCommission = async (commissionData) => {
  const response = await axios.post(COMMISSIONS_URL, commissionData);
  return response.data;
};
