import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import { validateEmail, validatePhoneNumber, validateCIN, areRequiredFieldsFilled } from "../../utils/validation";

const InternalAccountantForm = ({ show, onHide, userToEdit }) => {

  const { saveUser,checkEmailExists,refreshUsers } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    cin: "",
    gender: "MALE",
  });

  // Initialize form data with userToEdit values
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        firstName: userToEdit.firstName || "",
        lastName: userToEdit.lastName || "",
        email: userToEdit.email || "",
        phoneNumber: userToEdit.phoneNumber || userToEdit.phone || "",
        cin: userToEdit.cin || "",
        gender: userToEdit.gender || "MALE",
      });

      //reset the form data when the userToEdit changes
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        cin: "",
        gender: "MALE",
      });
    }
  }, [userToEdit, show]);


//  handle form submission
  const handleSubmit = async () => {
    const requiredFields = ["firstName", "lastName", "email", "phoneNumber", "cin"];

    // Check if all required fields are filled
    if (!areRequiredFieldsFilled(formData, requiredFields)) {
      toast.warn("Please fill in all required fields.");
      return;
    }
    
    // Validate email format
    if (!validateEmail(formData.email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    // Check if email already used by another user in the system
    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists && (!userToEdit || userToEdit.email.toLowerCase() !== formData.email.toLowerCase())) {
        toast.warn("This email is already in use by another user.");
        return;
      }
    } catch (error) {
      toast.error("Error verifying email availability");
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast.warn("Please enter a valid phone number (8-15 digits, optional '+').");
      return;
    }
    
    // Validate CIN format
    if (!validateCIN(formData.cin)) {
      toast.warn("Please enter a valid CIN number (8 digits).");
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        role: "INTERNAL_ACCOUNTANT",
        phone: formData.phoneNumber,
      };

      
      await saveUser(dataToSave, userToEdit?.id);
      refreshUsers(); 


      toast.success(`Accountant ${userToEdit ? "updated" : "created"} successfully!`);
      toast.info("email sent to accountant with login details");
      onHide();
    } catch (error) {
      toast.error(error.message || "Failed to save accountant");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{userToEdit ? "Edit" : "Add"} Internal Accountant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              First Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Last Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!userToEdit}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Phone Number <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
              maxLength={15}

            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              CIN <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter CIN number"
              value={formData.cin}
              onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
              required
              maxLength={8}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {userToEdit ? "Update Accountant" : "Save Accountant"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InternalAccountantForm;
