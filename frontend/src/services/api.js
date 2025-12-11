import { API_URL } from '../config/apiConfig';

export const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUserMeetups = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/users/me/meetups`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch user meetups');
  return response.json();
};

export const getReviews = async (meetupId) => {
  const response = await fetch(`${API_URL}/meetups/${meetupId}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const addReview = async (meetupId, reviewData) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/meetups/${meetupId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to add review');
  }
  return response.json();
};

export const getAllMeetups = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.date) params.append('date', filters.date);
  if (filters.location) params.append('location', filters.location);
  if (filters.category) params.append('category', filters.category);

  const url = params.toString() ? `${API_URL}/meetups?${params}` : `${API_URL}/meetups`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch meetups');
  return response.json();
};

export const getMeetupById = async (id) => {
  const response = await fetch(`${API_URL}/meetups/${id}`);
  if (!response.ok) throw new Error('Failed to fetch meetup');
  return response.json();
};

export const createMeetup = async (meetupData) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/meetups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(meetupData)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create meetup');
  }
  return response.json();
};

export const registerForMeetup = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/meetups/${id}/register`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to register');
  }
  return response.json();
};

export const unregisterFromMeetup = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/meetups/${id}/register`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to unregister');
  }
  return response.json();
};
