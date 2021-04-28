import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Router from "next/router";

export default function AuthReqModal({ show, handleModalShow }) {
  return (
    <Modal show={show} onHide={handleModalShow(false)}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>Please log in to continue</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => Router.push("/auth/login")}>
          Log in
        </Button>
        <Button variant="secondary" onClick={handleModalShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
