import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFolder } from '../../contexts/FolderContext';

const InternalAddFolderForm = ({ show, onHide, onSave, clients }) => {
  const { createFolder } = useFolder();
  const token = localStorage.getItem('token');

  const [selectedClientId, setSelectedClientId] = useState('');
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');

  // Handle folder creation logic
  const handleSave = async () => {
    if (!selectedClientId || !folderName.trim()) {
      toast.warn('Please fill all required fields.');
      return;
    }

    try {
      // Find the selected client by ID
      const selectedClient = clients.find(c => c.client.id === selectedClientId)?.client;


      // Prepare the folder data
      const folderData = {
        folderName,
        description: folderDescription,
        clientId: selectedClientId,
        clientName: selectedClient?.name || '',
      };

      // Create the folder through the API
      const createdFolder = await createFolder(folderData, token);
      createdFolder.client = selectedClient;

      // Pass the created folder to the parent component
      onSave(createdFolder);
      onHide();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select Client</Form.Label>
            <Form.Control
              as="select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">Choose client</option>
              {clients
                ?.filter(c => c && c.client) // élimine les cas problématiques
                .map(client => (
                  <option key={client.client.id} value={client.client.id}>
                    {client.client.name}
                  </option>
                ))}

            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Folder Name</Form.Label>
            <Form.Control
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Folder Description</Form.Label>
            <Form.Control
              as="textarea"
              value={folderDescription}
              onChange={(e) => setFolderDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Folder</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default InternalAddFolderForm;

