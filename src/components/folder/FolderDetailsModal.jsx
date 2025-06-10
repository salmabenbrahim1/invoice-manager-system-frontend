import { Modal, Button } from 'react-bootstrap';

const FolderDetailsModal = ({ show, onHide, folder }) => {
  if (!folder) return null;

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Folder Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Folder Name:</strong> {folder.folderName}</p>
        <p><strong>Description:</strong> {folder.description || 'No description'}</p>
        <p><strong>Created At:</strong> {new Date(folder.createdAt).toLocaleDateString()}</p>
        <p><strong>Invoice Count:</strong> {folder.invoiceCount || 0}</p>
        {/* Add more folder fields here as needed */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FolderDetailsModal;
