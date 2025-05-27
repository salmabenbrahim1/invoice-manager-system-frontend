import { useState } from 'react';
import { Modal, Button, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useClient } from '../../contexts/ClientContext';
import { useFolder } from '../../contexts/FolderContext'; 
import '../../styles/clients.css';

const AddFolderForm = ({ show, onHide, onSave }) => {
  const { clients, addClient } = useClient();
  const { createFolder } = useFolder(); 
  const token = localStorage.getItem('token'); 

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
            <h5 className="mb-4">1. Choose Client</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Card 
                  className={`client-selection-card ${clientType === 'existing' ? 'active' : ''}`}
                  onClick={() => setClientType('existing')}
                >
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <i className="bi bi-people-fill" style={{ fontSize: '2rem', color: clientType === 'existing' ? '#0d6efd' : '#6c757d' }}></i>
                    </div>
                    <Card.Title>Existing Client</Card.Title>
                    <Card.Text className="text-muted">
                      Select from your existing clients list
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card 
                  className={`client-selection-card ${clientType === 'new' ? 'active' : ''}`}
                  onClick={() => setClientType('new')}
                >
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <i className="bi bi-person-plus-fill" style={{ fontSize: '2rem', color: clientType === 'new' ? '#0d6efd' : '#6c757d' }}></i>
                    </div>
                    <Card.Title>New Client</Card.Title>
                    <Card.Text className="text-muted">
                      Add a new client to your system
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {clientType === 'existing' && (
              <div className="mt-4">
                <h6 className="mb-3">Select Client</h6>
                <Form.Select
                  size="lg"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}

            {clientType === 'new' && (
              <div className="mt-4">
                <h6 className="mb-3">Client Details</h6>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter client name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email address"
                          value={newClient.email}
                          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter phone number"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h5 className="mb-4">2. Folder Information</h5>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="folderName">
                  Folder Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="folderName"
                  size="lg"
                  placeholder="Enter folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="folderDescription">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  id="folderDescription"
                  rows={4}
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
          <Button variant="primary" size="lg" onClick={handleNext}>
            Next <i className="bi bi-arrow-right ms-2"></i>
          </Button>
        )}
        {step === 2 && (
          <>
            <Button variant="outline-secondary" size="lg" onClick={() => setStep(1)}>
              <i className="bi bi-arrow-left me-2"></i> Back
            </Button>
            <Button variant="primary" size="lg" onClick={handleSave}>
              Save Folder <i className="bi bi-check-lg ms-2"></i>
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddFolderForm;

