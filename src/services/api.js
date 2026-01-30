const BASE_URL = 'https://sode-matha-backend-1.onrender.com/api';

export const api = {
    getTimings: async () => {
        const res = await fetch(`${BASE_URL}/timings`);
        if (!res.ok) throw new Error('Failed to fetch timings');
        return res.json();
    },
    getEvents: async () => {
        const res = await fetch(`${BASE_URL}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    },
    getSevas: async () => {
        const res = await fetch(`${BASE_URL}/sevas`);
        if (!res.ok) throw new Error('Failed to fetch sevas');
        return res.json();
    },
    getVideos: async () => {
        const res = await fetch(`${BASE_URL}/videos`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
    },
    getRooms: async () => {
        const res = await fetch(`${BASE_URL}/rooms`);
        if (!res.ok) throw new Error('Failed to fetch rooms');
        return res.json();
    },

    // Firebase Token Verification
    verifyFirebaseToken: async (idToken, email, name) => {
        const res = await fetch(`${BASE_URL}/auth/verify-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken, email, name })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to verify token');
        }
        return res.json();
    },

    // Email OTP Authentication
    sendEmailOTP: async (email, name) => {
        const res = await fetch(`${BASE_URL}/auth/send-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to send OTP');
        }
        return res.json();
    },

    verifyEmailOTP: async (email, otp, name, password) => {
        const res = await fetch(`${BASE_URL}/auth/verify-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, name, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Invalid OTP');
        }
        return res.json();
    },

    // Legacy Mobile OTP (kept for compatibility)
    sendOTP: async (mobile) => {
        const res = await fetch(`${BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        });
        if (!res.ok) throw new Error('Failed to send OTP');
        return res.json();
    },
    verifyOTP: async (mobile, otp, name) => {
        const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, otp, name })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to verify OTP');
        }
        return res.json();
    },

    // Admin Login (pre-configured email/password)
    adminLogin: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Invalid admin credentials');
        }
        return res.json();
    },

    // Admin Endpoints
    getAdminLogs: async () => {
        const res = await fetch(`${BASE_URL}/admin/logs`);
        return res.json();
    },
    createSeva: async (data) => {
        const res = await fetch(`${BASE_URL}/admin/sevas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteSeva: async (id) => {
        await fetch(`${BASE_URL}/admin/sevas/${id}`, { method: 'DELETE' });
    },

    // Booking Endpoints
    createSevaBooking: async (data) => {
        const res = await fetch(`${BASE_URL}/bookings/seva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Booking failed');
        }
        return res.json();
    },
    createRoomBooking: async (data) => {
        const res = await fetch(`${BASE_URL}/bookings/room`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Booking failed');
        }
        return res.json();
    },

    // Admin Booking Endpoints
    getSevaBookings: async () => {
        const res = await fetch(`${BASE_URL}/admin/bookings/sevas`);
        return res.json();
    },
    getRoomBookings: async () => {
        const res = await fetch(`${BASE_URL}/admin/bookings/rooms`);
        return res.json();
    },
    updateBookingStatus: async (type, id, status) => {
        const res = await fetch(`${BASE_URL}/admin/bookings/${type}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return res.json();
    },
    deleteBooking: async (type, id) => {
        await fetch(`${BASE_URL}/admin/bookings/${type}/${id}`, { method: 'DELETE' });
    }
};
