import React from "react";
import { Modal, Button } from "react-bootstrap";

const InfoModal = ({ show, onHide, title, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Account Status"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p dangerouslySetInnerHTML={{ __html: message }}></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
