import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios';

const EditProfileForm = ({ show, onHide, onSave }) => {
  const { user } = useAuth(); 
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    companyName: '',
    cin: '',
    gender: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Récupère le token d'authentification
        const res = await axios.get('http://localhost:9090/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}` // Ajoute le token dans l'en-tête de la requête
          }
        });

        const data = res.data; // Données récupérées du backend
        setFormData({
          email: data.email || '',
          phone: data.phone || '',
          password: data.password || '',
          companyName: data.companyName || '',
          cin: data.cin || '',
          gender: data.gender || '',
          firstName: data.firstName || '',
          lastName: data.lastName || ''
        });
      } catch (error) {
        console.error('Erreur de chargement des données utilisateur :', error);
      }
    };

    if (user) {
      fetchData(); 
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Récupère le token d'authentification
      await axios.put('http://localhost:9090/api/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}` // Ajoute le token dans l'en-tête de la requête
        }
      });
      onSave(formData); 
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
                <Form.Label>CIN</Form.Label>
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
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileForm;
