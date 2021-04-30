import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Router from "next/router";

export default function AuthReqModal({ show, handleModalShow }) {
  return (
    <Modal show={show} onHide={() => handleModalShow(false)}>
      <Modal.Body>
        <h4 className="text-center align-self-center my-4">
          Please log in to continue
        </h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => Router.push("/auth/login")}>
          Log in
        </Button>
        <Button variant="primary" onClick={() => handleModalShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
