import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFolder } from '../../contexts/FolderContext';

const UpdateFolderForm = ({ show, onHide, folderData }) => {
  const { updateFolder, fetchFolders } = useFolder();

  const [formData, setFormData] = useState({
    clientName: '',
    folderName: '',
    description: '',

  });

  // Set formData when folderData changes
  useEffect(() => {
    if (folderData) {
      setFormData({
        clientName: folderData.client ? folderData.client.name : '',
        folderName: folderData.folderName || '',
        description: folderData.description || '',
      });
    }
  }, [folderData]);

const handleSave = async () => {
  if (!formData.folderName) {
    toast.warn('Please indicate the folder name.');
    return;
  }

  try {
    await updateFolder(folderData.id, {
      folderName: formData.folderName,
      description: formData.description,
    });

    await fetchFolders(); 
    toast.success('Folder updated successfully!');
    onHide();
  } catch (error) {
    toast.error('Failed to update folder.');
  }
};

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Form.Control
              type="text"
              value={formData.clientName}
              disabled
              plaintext
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Folder Name <span className="text-red-500">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={formData.folderName}
              onChange={(e) => setFormData({ ...formData, folderName: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add a description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSave}>
            Update Folder
          </Button>
        </Form>

      </Modal.Body>
    </Modal>
  );
};

export default UpdateFolderForm;
