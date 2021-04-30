import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import PropTypes from "prop-types";
import SuccessModal from "../../components/modals/successModal";

const CreateItem = ({ currentUser }) => {
  // Modal display state
  const [showModal, setShowModal] = useState(false);
  // Inputs
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // Data sending function and callback
  const { submitRequest, errors } = useRequest({
    url: "/api/items",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      clearInputs();
      handleModalShow(true);
    },
  });

  // Handler for Modal child
  const handleModalShow = (show) => {
    return setShowModal(show);
  };

  const clearInputs = () => {
    setTitle("");
    setPrice("");
  };

  // Format price input upon blur
  const onBlur = () => {
    const value = parseFloat(price);
    console.log(value);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  // Sending data on form submission
  const onSubmit = (event) => {
    event.preventDefault();
    submitRequest();
  };

  // Display loading until user is fetched
  if (!currentUser) {
    return <div className="container-subtitle">Loading...</div>;
  }

  return (
    <div className="container-md my-4 mx-4">
      <h2 className="container-title">Create item listing</h2>
      <form className="item-form my-4" onSubmit={onSubmit}>
        <div className="form-group form-group-medium">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control px-3"
            placeholder="Enter item name"
          />
        </div>
        <div className="form-group form-group-short">
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control px-3"
            placeholder="Enter item price (Eur)"
          />
        </div>
        {errors}
        <button className="btn btn-primary my-3">Submit</button>
      </form>
      <SuccessModal
        show={showModal}
        handleModalShow={handleModalShow}
      ></SuccessModal>
    </div>
  );
};

CreateItem.propTypes = {
  currentUser: {
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  },
};

export default CreateItem;
