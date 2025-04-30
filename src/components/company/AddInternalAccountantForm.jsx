import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";

import { useUser } from "../../context/UserContext";

const AddInternalAccountantForm = ({ show, onHide, userToEdit }) => {
  const { saveUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",

    cin: "",
    gender: "MALE"
  });
  const [tempPassword, setTempPassword] = useState(null);


  // Reset form when userToEdit changes or modal opens
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        firstName: userToEdit.firstName || "",
        lastName: userToEdit.lastName || "",
        email: userToEdit.email || "",
        phoneNumber: userToEdit.phoneNumber || userToEdit.phone || "",
        cin: userToEdit.cin || "",
        gender: userToEdit.gender || "MALE"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        cin: "",
        gender: "MALE"
      });
    }
    setTempPassword(null);
  }, [userToEdit, show]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || 
        !formData.email || !formData.phoneNumber || !formData.cin) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    // Phone validation
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.warn("Please enter a valid phone number (8-15 digits, optional '+').");
      return;
    }

    // CIN validation
    const cinRegex = /^[0-9]{8}$/;
    if (!cinRegex.test(formData.cin)) {
      toast.warn("Please enter a valid CIN (8 digits).");
      return;
    }

    try {

      const dataToSave = {
        ...formData,
        role: "INTERNAL ACCOUNTANT",
        phone: formData.phoneNumber // Ensure compatibility with backend
      };

      const savedUser = await saveUser(dataToSave, userToEdit?.id);

      if (!userToEdit && savedUser.password) {
        setTempPassword(savedUser.password);
        toast.success(
          <div>
            <p>Accountant created successfully!</p>
            <p className="mt-2">
              <strong>Temporary Password:</strong> {savedUser.password}
            </p>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.success(`Accountant ${userToEdit ? 'updated' : 'created'} successfully!`);
        onHide();
      }
    } catch (error) {
      toast.error(error.message || "Failed to save accountant");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {userToEdit ? 'Edit' : 'Add'} Internal Accountant
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {tempPassword ? (
          <div className="alert alert-info">
            <h5>Accountant Created Successfully!</h5>
            <p>
              <strong>Temporary Password:</strong> {tempPassword}
              <br />
              <small className="text-muted">
                (Please provide this password to the accountant)
              </small>
            </p>
            <Button 
              variant="primary" 
              onClick={() => {
                setTempPassword(null);
                onHide();
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={!!userToEdit}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>CIN <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.cin}
                onChange={(e) => setFormData({...formData, cin: e.target.value})}
                required
                maxLength={8}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </Form.Select>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      {!tempPassword && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {userToEdit ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default AddInternalAccountantForm;