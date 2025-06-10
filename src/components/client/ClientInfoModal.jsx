import { Modal, Button } from 'react-bootstrap';

const ClientInfoModal = ({ show, onHide, client }) => {
  if (!client) return null;

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Client Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Client Name:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
        {/* Add more fields as needed */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClientInfoModal;
