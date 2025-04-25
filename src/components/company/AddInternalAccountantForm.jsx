import React, { useState } from "react";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

const AddInternalAccountantForm = ({ show, onHide }) => {
  const [newAccountant, setNewAccountant] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    cin: "", // CIN
    gender: "", // Gender field
  });

  const handleSave = async () => {
    if (!newAccountant.firstName || !newAccountant.lastName || !newAccountant.email || !newAccountant.phoneNumber || !newAccountant.cin || !newAccountant.gender) {
      toast.warn("Please fill in all details.");
      return;
    }

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAccountant.email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    // Phone number validation regex (supports international formats)
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(newAccountant.phoneNumber)) {
      toast.warn("Please enter a valid phone number (8-15 digits, optional '+').");
      return;
    }

    // CIN validation
    const cinRegex = /^[0-9]{8}$/;
    if (!cinRegex.test(newAccountant.cin)) {
      toast.warn("Please enter a valid CIN (8 digits).");
      return;
    }

    try {
      // Send the request to create the internal accountant
      const response = await axios.post("/api/internal-accountants", newAccountant);
      toast.success("Internal Accountant added successfully!");

      // Reset form
      setNewAccountant({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        cin: "",
        gender: "",
      });
      onHide(); // Close modal
    } catch (error) {
      toast.error("Failed to add internal accountant.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Internal Accountant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>First Name <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={newAccountant.firstName}
              onChange={(e) => setNewAccountant({ ...newAccountant, firstName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={newAccountant.lastName}
              onChange={(e) => setNewAccountant({ ...newAccountant, lastName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={newAccountant.email}
              onChange={(e) => setNewAccountant({ ...newAccountant, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={newAccountant.phoneNumber}
              onChange={(e) => setNewAccountant({ ...newAccountant, phoneNumber: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CIN <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter CIN (8 digits)"
              value={newAccountant.cin}
              onChange={(e) => setNewAccountant({ ...newAccountant, cin: e.target.value })}
            />
          </Form.Group>

          {/* Gender Field */}
          <Form.Group className="mb-3">
            <Form.Label>Gender <span className="text-red-500">*</span></Form.Label>
            <Form.Control
              as="select"
              value={newAccountant.gender}
              onChange={(e) => setNewAccountant({ ...newAccountant, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddInternalAccountantForm;
