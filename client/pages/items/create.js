import { useState } from "react";
import useRequest from "../../hooks/useRequest";

import useUser from "../../hooks/useUser";
import SuccessModal from "../../components/modals/successModal";

const CreateItem = () => {
  // Require auth
  const { user } = useUser({ redirectTo: "/auth/register" });

  // Inputs
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  // Modal display state
  const [showModal, setShowModal] = useState(false);

  // Data sending function and callback
  const { submitRequest, errors } = useRequest({
    url: "/api/items",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      handleModalShow(true);
      clearInputs();
    },
  });

  // Handler for Modal child
  const handleModalShow = (show) => setShowModal(show);

  const clearInputs = () => {
    setTitle("");
    setPrice("");
  };

  // Format price input upon blur
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  // Sending data on form submission
  const onSubmit = (event) => {
    event.preventDefault();
    submitRequest();
  };

  // Display loading until user is fetched
  if (!user) {
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
      <SuccessModal show={showModal} handleModalShow={handleModalShow} />
    </div>
  );
};

export default CreateItem;
