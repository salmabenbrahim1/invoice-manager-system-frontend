import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import { useClient } from '../../contexts/ClientContext';

const UpdateClientForm = ({ show, onHide, clientData }) => {
  const { updateClient } = useClient(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Set formData when clientData changes
  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
      });
    }
  }, [clientData]);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
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
         if (!phoneRegex.test(formData.phone)) {
           toast.warn('Please enter a valid phone number (8-15 digits, optional "+").');
           return;
         }

    try {
      await updateClient( clientData.id, formData); 
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
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
