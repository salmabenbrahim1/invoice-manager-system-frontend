import { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useClient } from '../../contexts/ClientContext';
import { validateEmail, validatePhoneNumber } from '../../utils/validation'; // adjust path if needed

const AddClientForm = ({ show, onHide }) => {
  const { addClient, loading: contextLoading } = useClient();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const validateForm = () => {
    const errors = {};

    if (!newClient.name.trim()) errors.name = 'Name is required';

    if (!newClient.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(newClient.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!newClient.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(newClient.phone)) {
      errors.phone = 'Phone number must be 8 to 15 digits, optionally starting with +';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Keep only digits and optional leading +
      let newValue = value;

      if (newValue.startsWith('+')) {
        newValue = '+' + newValue.slice(1).replace(/\D/g, '');
      } else {
        newValue = newValue.replace(/\D/g, '');
      }

      setNewClient(prev => ({
        ...prev,
        phone: newValue
      }));
    } else {
      setNewClient(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addClient(newClient);
      toast.success('Client added successfully!');
      setNewClient({ name: '', email: '', phone: '' });
      onHide();
    } catch (error) {
      if (error.message.includes('already exists')) {
        setFormErrors(prev => ({
          ...prev,
          email: 'This email is already in use'
        }));
        toast.error('Client with this email already exists');
      } else {
        toast.error(error.message || 'Failed to add client');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add New Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formClientName">
            <Form.Label>Client Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter full name"
              value={newClient.name}
              onChange={handleChange}
              isInvalid={!!formErrors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formClientEmail">
            <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="example@domain.com"
              value={newClient.email}
              onChange={handleChange}
              isInvalid={!!formErrors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formClientPhone">
            <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="12345678"
              value={newClient.phone}
              onChange={handleChange}
              isInvalid={!!formErrors.phone}
              maxLength={16} // allow + and up to 15 digits
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              disabled={isSubmitting || contextLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting || contextLoading}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : 'Save Client'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddClientForm;
