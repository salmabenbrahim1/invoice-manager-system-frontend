import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchNotifications, markAllAsRead, deleteOldNotifications } from '../services/notificationService';
import { jwtDecode } from 'jwt-decode';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [accountantId, setAccountantId] = useState(null);

    useEffect(() => {
        if (user?.token) {
            try {
                const decoded = jwtDecode(user.token);
                setAccountantId(decoded.id);
            } catch (err) {
                console.error("Token decoding error", err);
            }
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!accountantId) return;
        try {
            const data = await fetchNotifications(accountantId);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (err) {
            console.error('Error loading notifications', err);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [accountantId]);

    const markAllNotificationsAsRead = async () => {
        if (!accountantId) return;
        try {
            await markAllAsRead(accountantId);
            await loadNotifications();
        } catch (err) {
            console.error('Error updating notifications', err);
        }
    };


    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loadNotifications,
            markAllNotificationsAsRead,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
