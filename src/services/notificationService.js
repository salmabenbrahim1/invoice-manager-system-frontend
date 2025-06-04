import axios from 'axios';

const API_BASE = 'http://localhost:9090/api/notifications';

export const fetchNotifications = async (accountantId) => {
    if (!accountantId) return [];
    const res = await axios.get(`${API_BASE}/${accountantId}`);
    return res.data;
};

export const markAllAsRead = async (accountantId) => {
    if (!accountantId) return;
    await axios.put(`${API_BASE}/${accountantId}/read-all`);
};


