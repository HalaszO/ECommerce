import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function SuccessModal({ show, handleModalShow }) {
  return (
    <Modal show={show} onHide={() => handleModalShow(false)}>
      <Modal.Body>
        <h4 className="text-center align-self-center my-4">
          Item listing successfully created!
        </h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleModalShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
