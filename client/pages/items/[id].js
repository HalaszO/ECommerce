import Router from "next/router";
import { useState } from "react";
import fetchFromServer from "../api/fetchFromServer";
import useRequest from "../../hooks/useRequest";
import useUser from "../../hooks/useUser";
import AuthReqModal from "../../components/modals/authReqModal";

// Prerendering pages for items
export async function getStaticPaths({ req }) {
  const { data: items } = await fetchFromServer("/api/items", req.headers);
  const paths = items.map((item) => ({
    params: {
      id: item.id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

// Get item info on server and pass it to the page component
export async function getStaticProps({ req, params }) {
  const { data: item } = await fetchFromServer(
    `/api/items/${params.id}`,
    req.headers
  );
  return {
    props: {
      item,
    },
  };
}

const ItemDisplay = ({ item }) => {
  // Modal display state
  const [showModal, setShowModal] = useState(false);
  // Fetching user
  const { user } = useUser();

  // Request hook to send (create) the order
  const { submitRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      itemId: item.id,
    },
    onSuccess: (order) => Router.push("/orders/[id]", `/orders/${order.id}`),
  });

  // Handler for Modal child
  const handleModalShow = (show) => setShowModal(show);
  // Handler for 'Buy' btn click
  const handleOnclickBuy = () => {
    // If authenticated proceed to create the order
    // Else, display modal to inform the user to sign in
    if (user) {
      submitRequest();
    } else {
      setShowModal(true);
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
      <AuthReqModal show={showModal} handleModalShow={handleModalShow} />
    </div>
  );
};

export default ItemDisplay;
