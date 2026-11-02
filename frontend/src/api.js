import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchEmployees = async () => {
  const response = await axios.get(`${API_BASE}/employees`);
  // API returns { success, count, data }
  return response.data.data;
};

export const getEmployee = async (id) => {
  const response = await axios.get(`${API_BASE}/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await axios.post(`${API_BASE}/employees`, employee);
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const response = await axios.put(`${API_BASE}/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_BASE}/employees/${id}`);
  return response.data;
};
