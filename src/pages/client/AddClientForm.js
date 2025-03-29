import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import { useClient } from '../../components/client/ClientContext';

const AddClientForm = ({ show, onHide }) => {
  const { handleAddClient } = useClient();

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const handleSave = async () => {
    if (!newClient.name || !newClient.email || !newClient.phoneNumber) {
      toast.warn('Please fill in all client details.');
      return;
    }
    // Email validation regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newClient.email)) {
    toast.warn('Please enter a valid email address.');
    return;
  }
   // Phone number validation regex (supports international formats)
   const phoneRegex = /^\+?[0-9]{8,15}$/; 
   if (!phoneRegex.test(newClient.phoneNumber)) {
     toast.warn('Please enter a valid phone number (8-15 digits, optional "+").');
     return;
   }

    try {
      await handleAddClient(newClient); 
      toast.success('Client added successfully!');
      setNewClient({ name: '', email: '', phoneNumber: '' }); // Reset form
      onHide(); // Close modal
    } catch (error) {
      toast.error('Failed to add client.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Client Name<span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={newClient.phoneNumber}
              onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSave}>Save Client</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddClientForm;
