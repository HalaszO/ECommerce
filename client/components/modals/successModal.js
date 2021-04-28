import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function SuccessModal({ show, handleModalShow }) {
  return (
    <Modal show={show} onHide={handleModalShow(false)}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>Item listing successfully created!</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleModalShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
