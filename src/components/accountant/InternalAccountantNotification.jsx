import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import { useNotifications } from '../../contexts/NotificationContext';

const InternalAccountantNotification = () => {
    const { notifications, unreadCount, markAllNotificationsAsRead } = useNotifications();
    const [showModal, setShowModal] = useState(false);

    const handleIconClick = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const styles = {
        notificationIcon: {
            position: 'relative',
            cursor: 'pointer',
            marginRight: '15px'
        },
        badge: {
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center'
        },
        notificationItem: {
            padding: '12px 15px',
            borderBottom: '1px solid #eee',
            transition: 'background-color 0.2s',
            cursor: 'default',
        },
        modalBody: {
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: 0
        }
    };

    return (
        <>
            <div style={styles.notificationIcon} onClick={handleIconClick}>
                <FaBell size={22} color="#FFD765" title="Notifications" />
                {unreadCount > 0 && (
                    <span style={styles.badge}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-bottom-0">
                    <Modal.Title className="fw-bold">Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body style={styles.modalBody}>
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div
                                key={notif.id}
                                style={{
                                    ...styles.notificationItem,
                                    backgroundColor: notif.read ? '#f9f9f9' : '#e6f7ff'
                                }}
                            >
                                <div className="d-flex justify-content-between">
                                    <span>{notif.message}</span>
                                    <small className="text-muted">
                                        {new Date(notif.createdAt).toLocaleTimeString()}
                                    </small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted">No notifications</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-top-0">
                    <Button
                        variant="outline-secondary"
                        onClick={handleClose}
                        style={{ borderRadius: '20px' }}
                    >
                        Fermer
                    </Button>
                    {notifications.length > 0 && (
                        <Button
                            variant="outline-primary"
                            style={{ borderRadius: '20px' }}
                            onClick={markAllNotificationsAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default InternalAccountantNotification;
