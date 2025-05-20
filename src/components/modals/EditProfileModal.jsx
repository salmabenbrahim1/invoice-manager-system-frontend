import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FloatingLabel, Spinner, Image } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { FiUser, FiCamera, FiX, FiEdit2, FiPhone, FiMail, FiLock, FiBriefcase } from 'react-icons/fi';
import '../../styles/EditProfileModal.css';

const EditProfileModal = ({ show, onHide, onSave }) => {
  const { profile, loading, error, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    gender: '',
    companyName: '',
    cin: '',
    newPassword: '',
    profileImage: null,
    profileImageUrl: '',
    removeImage: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        email: profile.email || '',
        phone: profile.phone || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || '',
        companyName: profile.companyName || '',
        cin: profile.cin || '',
        newPassword: '',
        profileImage: null,
        profileImageUrl: profile.profileImageUrl || ''
      }));
      setImagePreview(profile.profileImageUrl || null);
    }
  }, [profile, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        removeImage: false 
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImageUrl: '',
      removeImage: true 
    }));
    setImagePreview(null);
  };


  const validateForm = () => {
    if (!formData.email) {
      toast.warn('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn('Invalid email format');
      return false;
    }

    if (formData.phone && !/^\+?[\d\s-]{8,15}$/.test(formData.phone)) {
      toast.warn('Phone number must be 8-15 digits');
      return false;
    }

    if (profile.role === 'COMPANY') {
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
      role: profile.role,
      ...(profile.role === 'COMPANY'
        ? { companyName: formData.companyName }
        : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          cin: formData.cin
        }),
      password: formData.newPassword && formData.newPassword.trim() !== '' ? formData.newPassword : undefined
    };

    const formPayload = new FormData();
    formPayload.append('data', new Blob([JSON.stringify(updateData)], { type: 'application/json' }));
    formPayload.append('removeImage', formData.removeImage ? 'true' : 'false');
    if (formData.profileImage) {
      formPayload.append('image', formData.profileImage);
    }

    await updateProfile(formPayload);
    toast.success('Profile updated successfully');
    onSave();
    onHide();
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
  } finally {
    setIsSubmitting(false);
  }
};

  if (error) {
    return (
      <>
        <div className="modern-alert-error">
          Error loading profile: {error.message || error}
        </div>
      </>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg" className="modern-profile-modal">
        <Modal.Header closeButton className="modern-modal-header">
          <Modal.Title className="modern-modal-title">
            <FiEdit2 className="modern-title-icon" />
            Edit Your Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modern-modal-body">
          <Form onSubmit={handleSubmit} className="modern-profile-form">
            <div className="modern-form-container">
              <div className="modern-image-section">
                <div className="modern-image-container">
                  {imagePreview ? (
                    <div className="modern-image-wrapper">
                      <Image src={imagePreview} roundedCircle className="modern-profile-image" />
                      <button
                        type="button"
                        className="modern-remove-image-btn"
                        onClick={removeImage}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className="modern-image-placeholder">
                      <FiUser className="modern-placeholder-icon" />
                    </div>
                  )}
                </div>
                <label className="modern-upload-btn">
                  <FiCamera className="me-2" />
                  {imagePreview
                    ? (profile.role === 'COMPANY' ? 'Change Logo' : 'Change Photo')
                    : (profile.role === 'COMPANY' ? 'Upload Logo' : 'Upload Photo')}
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="modern-file-input"
                  />
                </label>
              </div>

              <div className="modern-fields-section">
                <FloatingLabel controlId="email" label="Email address" className="mb-3 modern-floating-label">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="modern-form-control"
                  />
                  <FiMail className="modern-input-icon" />
                </FloatingLabel>

                <FloatingLabel controlId="phone" label="Phone number" className="mb-3 modern-floating-label">
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" "
                    className="modern-form-control"
                  />
                  <FiPhone className="modern-input-icon" />
                </FloatingLabel>

                <FloatingLabel
                  controlId="newPassword"
                  label={
                    <>
                      <span className="modern-password-label">New password</span>
                      <span className="modern-password-hint">(leave blank to maintain current secure password)</span>
                    </>
                  }
                  className="mb-3 modern-floating-label"
                >
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder=" "
                    minLength={8}
                    className="modern-form-control"
                  />
                  <FiLock className="modern-input-icon" />
                </FloatingLabel>

                {profile.role === 'COMPANY' ? (
                  <FloatingLabel controlId="companyName" label="Company name" className="mb-3 modern-floating-label">
                    <Form.Control
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className="modern-form-control"
                    />
                    <FiBriefcase className="modern-input-icon" />
                  </FloatingLabel>
                ) : (
                  <>
                    <div className="modern-name-fields">
                      <FloatingLabel controlId="firstName" label="First name" className="mb-3 modern-floating-label">
                        <Form.Control
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          className="modern-form-control"
                        />
                        <FiUser className="modern-input-icon" />
                      </FloatingLabel>

                      <FloatingLabel controlId="lastName" label="Last name" className="mb-3 modern-floating-label">
                        <Form.Control
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          className="modern-form-control"
                        />
                        <FiUser className="modern-input-icon" />
                      </FloatingLabel>
                    </div>

                    <FloatingLabel controlId="cin" label="CIN (8 digits)" className="mb-3 modern-floating-label">
                      <Form.Control
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        maxLength={8}
                        placeholder=" "
                        className="modern-form-control"
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="gender" label="Gender" className="mb-3 modern-floating-label">
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="modern-form-control"
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </Form.Select>
                    </FloatingLabel>
                  </>
                )}
              </div>
            </div>

            <div className="modern-form-actions">
              <Button
                variant="outline-secondary"
                onClick={onHide}
                className="modern-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="modern-save-btn"
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfileModal;
