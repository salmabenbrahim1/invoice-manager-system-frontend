import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { toast } from 'react-toastify';

const EditProfileForm = ({ show, onHide, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    companyName: '',
    cin: '',
    gender: '',
    firstName: '',
    lastName: '',
    newPassword: ''
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const data = await getUserProfile();
          setFormData((prev) => ({
            ...prev,
            email: data.email || '',
            phone: data.phone || '',
            companyName: data.companyName || '',
            cin: data.cin || '',
            gender: data.gender || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            newPassword: ''
          }));
        } catch (error) {
          console.error('Error loading profile: ', error);
          toast.error('Failed to load profile.');
        }
      };

      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      email,
      phone,
      companyName,
      firstName,
      lastName,
      cin,
      gender,
      newPassword
    } = formData;

    const dataToSend = { email, phone };

    if (user.role === 'COMPANY') {
      dataToSend.companyName = companyName;
    } else {
      dataToSend.firstName = firstName;
      dataToSend.lastName = lastName;
      dataToSend.cin = cin;
      dataToSend.gender = gender;
    }

    if (newPassword && newPassword.trim() !== '') {
      dataToSend.password = newPassword;
    }

    try {
      await updateUserProfile(dataToSend);
      toast.success('Profile updated successfully!');
      if (onSave) onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile.');
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep unchanged"
            />
          </Form.Group>

          {user.role === 'COMPANY' ? (
            <Form.Group controlId="companyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Group>
          ) : (
            <>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="cin">
                <Form.Label>ID Number (CIN)</Form.Label>
                <Form.Control
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>
            </>
          )}
          <Button variant="primary" type="submit" className="mt-3">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileForm;
