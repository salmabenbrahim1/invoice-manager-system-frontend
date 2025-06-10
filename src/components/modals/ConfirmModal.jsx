import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  title, 
  message, 
  isDeactivation, 
  isActive 
}) => {
  const getButtonConfig = () => {
    if (!isDeactivation) return { label: "Delete", variant: "danger" };
    return isActive 
      ? { label: "Deactivate", variant: "warning" }
      : { label: "Activate", variant: "success" };
  };

  const { label, variant } = getButtonConfig();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirm Action"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message || <p>Are you sure you want to proceed?</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {label}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;