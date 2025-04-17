import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import { useClient } from '../../context/ClientContext';

const UpdateClientForm = ({ show, onHide, clientData }) => {
  const { handleUpdateClient } = useClient(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  // Set formData when clientData changes
  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || '',
        email: clientData.email || '',
        phoneNumber: clientData.phoneNumber || '',
      });
    }
  }, [clientData]);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      toast.warn('Please fill in all client details.');
      return;
    }
     // Email validation regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.warn('Please enter a valid email address.');
        return;
      }
     // Phone number validation regex (supports international formats)
         const phoneRegex = /^\+?[0-9]{8,15}$/; 
         if (!phoneRegex.test(formData.phoneNumber)) {
           toast.warn('Please enter a valid phone number (8-15 digits, optional "+").');
           return;
         }

    try {
      await handleUpdateClient(clientData.id, formData); 
      toast.success('Client updated successfully!');
      onHide(); // Close the modal
    } catch (error) {
      toast.error('Failed to update client.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Client Name <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSave}>
            Update Client
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateClientForm;
