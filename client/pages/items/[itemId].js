import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import PropTypes from "prop-types";
import AuthReqModal from "../../components/modals/authReqModal";

const ItemDisplay = ({ item, currentUser }) => {
  const { submitRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      itemId: item.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  // Modal display state
  const [showModal, setShowModal] = useState(false);

  // Handler for Modal child
  const handleModalShow = (show) => setShowModal(show);
  // Handler for 'Buy' btn click
  const handleOnclickBuy = () => {
    // If authenticated proceed to create the order
    // Else, display modal to inform the user to sign in
    if (currentUser) {
      submitRequest();
    } else {
      handleModalShow(true);
    }
  };

  return (
    <div className="container-md my-4">
      <h1>{item.title}</h1>
      <h4>{item.price} EUR</h4>
      {errors}
      <button onClick={handleOnclickBuy} className="btn btn-primary my-3">
        Buy
      </button>
      <AuthReqModal
        show={showModal}
        handleModalShow={handleModalShow}
      ></AuthReqModal>
    </div>
  );
};

ItemDisplay.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/items/${itemId}`);

  return { item: data };
};

ItemDisplay.propTypes = {
  currentUser: {
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  },
  item: {
    id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.string,
    orderId: PropTypes.string,
  },
};

export default ItemDisplay;
