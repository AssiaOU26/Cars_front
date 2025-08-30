// client/src/api.js

// This is the central function for all API calls.
// It automatically adds the JWT token to the request headers and prefixes API base.
// Determine API base.
// - In production on Vercel, set VITE_API_BASE to your backend origin (e.g., https://api.example.com)
// - If VITE_API_BASE is not set, fall back to same-origin (useful when /api is proxied via rewrites)
const ENV_API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) ? String(import.meta.env.VITE_API_BASE).trim() : '';
const API_BASE = ENV_API_BASE ? ENV_API_BASE.replace(/\/$/, '') : '';

async function apiCall(endpoint, options = {}) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // If a token exists, add it to the Authorization header
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}` || endpoint, { ...options, headers });

        if (!response.ok) {
            // If the token is invalid (401/403), log the user out
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.reload(); // Reload the page to go back to the login screen
            }
            const errorBody = await response.json().catch(() => ({ message: 'Network response was not ok' }));
            throw new Error(errorBody.error || 'An unknown error occurred');
        }

        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
}

// --- API Functions ---

export function fetchRequests(params = undefined) {
    let queryString = '';
    if (params && (params.status || params.q || params.limit || params.offset)) {
        const search = new URLSearchParams();
        if (params.status) search.set('status', params.status);
        if (params.q) search.set('q', params.q);
        if (params.limit) search.set('limit', String(params.limit));
        if (params.offset) search.set('offset', String(params.offset));
        queryString = `?${search.toString()}`;
    }
    return apiCall(`/api/requests${queryString}`);
}

export function fetchContacts() {
    return apiCall('/api/contacts');
}

export function fetchUsers() {
    return apiCall('/api/users');
}

export function submitAssignment(assignmentData) {
    return apiCall('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(assignmentData),
    });
}

export function updateRequestStatus(requestId, status) {
    return apiCall(`/api/requests/${requestId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

export function deleteContact(contactId) {
    return apiCall(`/api/contacts/${contactId}`, {
        method: 'DELETE',
    });
}

export function createContact(contactData) {
    return apiCall('/api/contacts', {
        method: 'POST',
        body: JSON.stringify(contactData),
    });
}

export function updateContact(contactId, contactData) {
    return apiCall(`/api/contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(contactData),
    });
}

export function deleteRequest(requestId) {
    return apiCall(`/api/requests/${requestId}`, {
        method: 'DELETE',
    });
}

export function loginUser(credentials) {
    return apiCall('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export function registerUser(credentials) {
    return apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export function updateUserStatus(userId, status) {
    return apiCall(`/api/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

export function fetchOverviewStats() {
    return apiCall('/api/stats/overview');
}

export function fetchMe() {
    return apiCall('/api/me');
}

// Special case: multipart/form-data for creating requests
export async function createRequest(formData) {
    try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(`${API_BASE}/api/requests` || '/api/requests', {
            method: 'POST',
            headers,
            body: formData,
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.reload();
            }
            const errorBody = await response.json().catch(() => ({ message: 'Network response was not ok' }));
            throw new Error(errorBody.error || 'An unknown error occurred');
        }
        return await response.json();
    } catch (error) {
        console.error('API createRequest failed:', error);
        throw error;
    }
}

export function createRequestJson(payload) {
    return apiCall('/api/requests', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
