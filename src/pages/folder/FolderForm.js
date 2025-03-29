import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useClient } from '../../components/client/ClientContext';
import { useFolder } from '../../components/folder/FolderContext';


const FolderForm = ({ show, onHide, onSave }) => {
  const { clients, handleAddClient } = useClient();
  const { handleAddFolder } = useFolder();

  // Step 1: Client Info, Step 2: Folder Info
  const [step, setStep] = useState(1); 
  const [clientType, setClientType] = useState('existing');

  // Folder Info
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');


  // Client Info
  const [selectedClientId, setSelectedClientId] = useState('');

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });



  const handleNext = () => {
    if (step === 1) {

      // Validate client information 
      if (clientType === 'existing' && !selectedClientId) {
        toast.warn('Please select an existing client.');
        return;
      }
      if (clientType === 'new' && (!newClient.name || !newClient.email || !newClient.phoneNumber)) {
        toast.warn('Please fill in all client details.');
        return;
      }
      // Email validation regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if ( clientType === 'new' && !emailRegex.test(newClient.email)) {
        toast.warn('Please enter a valid email address.');
        return;
      }
      // Phone number validation regex (supports international formats)
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if ( clientType === 'new'&& !phoneRegex.test(newClient.phoneNumber)) {
        toast.warn('Please enter a valid phone number (8-15 digits, optional "+").');
        return;
      }

      setStep(2);
    }
  };

  const handleSave = async () => {
    // Validate folder name
    if (!folderName.trim()) {
      toast.warn('Please enter a folder name.');
      return;
    }
    try {
      let clientData = {};
      let clientName = '';

      if (clientType === 'new') {

        // Validate new client details
        if (!newClient.name || !newClient.email || !newClient.phoneNumber) {
          toast.warn('Please fill in all client details.');
          return;
        }
        //indicate a new client
        const addedClient = await handleAddClient(newClient);
        clientData = { id: addedClient._id };
        clientName = newClient.name;
      } else {
        // For an existing client, validate the selected client ID
        if (!selectedClientId) {
          toast.warn('Please select an existing client.');
          return;
        }

        clientData = { id: selectedClientId };

        const selectedClient = clients.find((client) => client._id === selectedClientId);
        clientName = selectedClient ? selectedClient.name : ''; 
      }

      
      const folderData = {
        name: folderName,
        description: folderDescription,
        clientId: clientData,
        clientName: clientName,
      };

      const createdFolder = await handleAddFolder(folderData);

      if (clientType === 'new') {
        createdFolder.client = { _id: createdFolder.clientId, name: newClient.name };
      } else {
        const selectedClient = clients.find(
          (client) => client._id === selectedClientId
        );
        createdFolder.client = selectedClient;
      }

      toast.success('Folder created successfully!');
      onSave(createdFolder); // Add the new folder to the list
      onHide(); // Close the Form
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder.');
    }
  };



  const resetForm = () => {
    setStep(1);
    setClientType('existing');
    setFolderName('');
    setFolderDescription('');
    setSelectedClientId('');
    setNewClient({ name: '', email: '', phoneNumber: '' });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" onExited={resetForm}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <>
            <h5>1. Choose Client</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label="Existing Client"
                  name="clientType"
                  checked={clientType === 'existing'}
                  onChange={() => setClientType('existing')}
                />
                {clientType === 'existing' && (
                  <Form.Control
                    as="select"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label="New Client"
                  name="clientType"
                  checked={clientType === 'new'}
                  onChange={() => setClientType('new')}
                />
                {clientType === 'new' && (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="Client Name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="mb-2"
                    />
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="mb-2"
                    />
                    <Form.Control
                      type="text"
                      placeholder="Phone Number"
                      value={newClient.phoneNumber}
                      onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
                      className="mb-2"
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </>
        )}

        {step === 2 && (
          <>
            <h5>2. Folder Information</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Folder Name <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Folder Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter folder description (optional)"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                />
              </Form.Group>
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {step === 1 && (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {step === 2 && (
          <>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Folder
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FolderForm;
