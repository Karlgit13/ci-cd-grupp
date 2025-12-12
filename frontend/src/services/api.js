import { API_URL } from '../config/apiConfig';

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

// Helper for authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('Unauthorized');
  }

  return response;
};

// Helper for optional authentication (sends token if available)
const optionalAuthFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  return response;
};

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

export const getUserMeetups = async () => {
  const response = await authFetch('/users/me/meetups');
  if (!response.ok) throw new Error('Failed to fetch user meetups');
  return response.json();
};

export const getPastUserMeetups = async () => {
  const response = await authFetch('/users/me/past-meetups');
  if (!response.ok) throw new Error('Failed to fetch past meetups');
  return response.json();
};

export const getReviews = async (meetupId) => {
  const response = await fetch(`${API_URL}/meetups/${meetupId}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const addReview = async (meetupId, reviewData) => {
  const response = await authFetch(`/meetups/${meetupId}/reviews`, {
    method: 'POST',
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

  const url = params.toString() ? `/meetups?${params}` : `/meetups`;
  const response = await optionalAuthFetch(url); // Updated to send auth if available
  if (!response.ok) throw new Error('Failed to fetch meetups');
  return response.json();
};

export const getMeetupById = async (id) => {
  const response = await optionalAuthFetch(`/meetups/${id}`); // Updated to send auth
  if (!response.ok) throw new Error('Failed to fetch meetup');
  return response.json();
};

export const createMeetup = async (meetupData) => {
  const response = await authFetch('/meetups', {
    method: 'POST',
    body: JSON.stringify(meetupData)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create meetup');
  }
  return response.json();
};

export const registerForMeetup = async (id) => {
  const response = await authFetch(`/meetups/${id}/register`, {
    method: 'POST'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to register');
  }
  return response.json();
};

export const unregisterFromMeetup = async (id) => {
  const response = await authFetch(`/meetups/${id}/register`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to unregister');
  }
  return response.json();
};
