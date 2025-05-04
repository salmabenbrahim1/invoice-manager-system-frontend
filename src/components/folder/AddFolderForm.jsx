import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useClient } from '../../context/ClientContext';
import { useFolder } from '../../context/FolderContext'; // Assure-toi que le hook correspond bien

const AddFolderForm = ({ show, onHide, onSave }) => {
  const { clients, addClient } = useClient();
  const { createFolder } = useFolder(); // ✅ Correction ici : fonction venant du contexte
  const token = localStorage.getItem('token'); // ✅ Assure-toi d'avoir un token valide

  const [step, setStep] = useState(1);
  const [clientType, setClientType] = useState('existing');

  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');

  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleNext = () => {
    if (step === 1) {
      if (clientType === 'existing' && !selectedClientId) {
        toast.warn('Please select an existing client.');
        return;
      }
      if (clientType === 'new' && (!newClient.name || !newClient.email || !newClient.phone)) {
        toast.warn('Please fill in all client details.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (clientType === 'new' && !emailRegex.test(newClient.email)) {
        toast.warn('Please enter a valid email address.');
        return;
      }

      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (clientType === 'new' && !phoneRegex.test(newClient.phone)) {
        toast.warn('Please enter a valid phone number (8-15 digits, optional "+").');
        return;
      }

      setStep(2);
    }
  };

  const handleSave = async () => {
    if (!folderName.trim()) {
      toast.warn('Please enter a folder name.');
      return;
    }

    try {
      let clientId = '';
      let clientName = '';

      if (clientType === 'new') {
        const addedClient = await addClient(newClient);
        clientId = addedClient.id;
        clientName = addedClient.name;
      } else {
        clientId = selectedClientId;
        const selectedClient = clients.find(client => client.id === selectedClientId);
        clientName = selectedClient?.name || '';
      }

      const folderData = {
        folderName,
        description: folderDescription,
        clientId, 
        clientName,
      };

      const createdFolder = await createFolder(folderData, token); 

      // Associer client à la réponse
      createdFolder.client = clientType === 'new'
        ? { id: clientId, name: newClient.name }
        : clients.find(client => client.id === clientId);

      onSave(createdFolder);
      onHide();
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
    setNewClient({ name: '', email: '', phone: '' });
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
                  id="clientTypeExisting"
                  checked={clientType === 'existing'}
                  onChange={() => setClientType('existing')}
                />
                {clientType === 'existing' && (
                  <Form.Control
                    as="select"
                    id="existingClientSelect"
                    name="existingClientSelect"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
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
                  id="clientTypeNew"
                  checked={clientType === 'new'}
                  onChange={() => setClientType('new')}
                />
                {clientType === 'new' && (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="Client Name"
                      id="clientName"
                      name="clientName"
                      autoComplete="name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="mb-2"
                    />
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      id="clientEmail"
                      name="clientEmail"
                      autoComplete="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="mb-2"
                    />
                    <Form.Control
                      type="text"
                      placeholder="Phone Number"
                      id="clientPhone"
                      name="clientPhone"
                      autoComplete="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
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
            <h5>2. Folder Informations</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="folderName">
                  Folder Name <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="folderName"
                  name="folderName"
                  placeholder="Enter folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="folderDescription">Folder Description</Form.Label>
                <Form.Control
                  as="textarea"
                  id="folderDescription"
                  name="folderDescription"
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

export default AddFolderForm;
