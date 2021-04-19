import Router from "next/router";
import useRequest from "../../hooks/useRequest";
const ItemDisplay = ({ item }) => {
  const { submitRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      itemId: item.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div class="container-md my-4">
      <h1>{item.title}</h1>
      <h4>{item.price} EUR</h4>
      {errors}
      <button onClick={() => submitRequest()} className="btn btn-primary my-3">
        Buy
      </button>
    </div>
  );
};

ItemDisplay.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/items/${itemId}`);

  return { item: data };
};

export default ItemDisplay;
