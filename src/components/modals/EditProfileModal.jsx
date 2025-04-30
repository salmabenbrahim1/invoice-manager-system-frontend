import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner';

const EditProfileModal = ({ show, onHide, onSave }) => {
  const { currentUser, loading, error, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    gender: '',
    companyName: '',
    cin: '',
    newPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with currentUser data when it changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        gender: currentUser.gender || '',
        companyName: currentUser.companyName || '',
        cin: currentUser.cin || '',
        newPassword: ''
      });
    }
  }, [currentUser, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Common validations for all users
    if (!formData.email) {
      toast.warn('Email is required');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn('Please enter a valid email address');
      return false;
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{8,15}$/.test(formData.phone)) {
      toast.warn('Please enter a valid phone number (8-15 digits)');
      return false;
    }

    // Role-specific validations
    if (currentUser.role === 'COMPANY') {
      if (!formData.companyName) {
        toast.warn('Company name is required');
        return false;
      }
    } else {
      if (!formData.firstName || !formData.lastName) {
        toast.warn('First and last names are required');
        return false;
      }

      if (formData.cin && !/^[0-9]{8}$/.test(formData.cin)) {
        toast.warn('CIN must be 8 digits');
        return false;
      }
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      const updateData = {
        email: formData.email,
        phone: formData.phone,
        ...(currentUser.role === 'COMPANY'
          ? { companyName: formData.companyName }
          : {
              firstName: formData.firstName,
              lastName: formData.lastName,
              gender: formData.gender,
              cin: formData.cin
            }),
        newPassword: formData.newPassword // Facultatif
      };
  
      console.log('Updating profile with data:', updateData);  // Ajoutez un log pour vérifier les données envoyées.
      await updateProfile(updateData);
      toast.success('Profile successfully updated');
      onSave();
      onHide();
    } catch (error) {
      console.error('Error updating profile :', error);
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
};


  if (error) return (
    <div className="alert alert-danger">
      Error loading profile: {error.message || error}
    </div>
  );

  if (!currentUser) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              minLength={8}
            />
            <Form.Text className="text-muted">
              Minimum 8 characters
            </Form.Text>
          </Form.Group>

          {currentUser.role === 'COMPANY' ? (
            <Form.Group className="mb-3" controlId="companyName">
              <Form.Label>Company Name *</Form.Label>
              <Form.Control
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ) : (
            <>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="cin">
                <Form.Label>ID Number (CIN)</Form.Label>
                <Form.Control
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  maxLength={8}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
             <Form.Select
             name="gender"
                value={formData.gender}
              onChange={handleChange}
                  >
                <option value="">Select...</option>
                <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                     </Form.Select>
                  </Form.Group>

            </>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
