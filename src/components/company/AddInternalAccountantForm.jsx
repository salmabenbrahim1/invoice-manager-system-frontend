import React, { useState } from "react";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import { useUser } from "../../context/UserContext"; 
import axios from "axios";

const AddInternalAccountantForm = ({ show, onHide }) => {
  const { handleAddInternalAccountant } = useUser(); // Function to add the internal accountant

  const [newAccountant, setNewAccountant] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    cin: "", // CIN
    password: "", // Password will be fetched from the backend
  });

  // Handle form submission
  const handleSave = async () => {
    if (!newAccountant.firstName || !newAccountant.lastName || !newAccountant.email || !newAccountant.phoneNumber || !newAccountant.cin) {
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
      const response = await axios.post("/api/internal-accountants/add", newAccountant);
      toast.success("Internal Accountant added successfully!");

      // Store the password in the state to show in the form
      setNewAccountant({ ...newAccountant, password: response.data.password });

      setNewAccountant({ firstName: "", lastName: "", email: "", phoneNumber: "", cin: "", password: "" }); // Reset form
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
          <div className="text-sm text-gray-700">Password will be auto-generated.</div>

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
