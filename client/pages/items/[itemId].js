import useRequest from "../../hooks/useRequest";
const itemDisplay = ({ item }) => {
  const { submitRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      itemId: item.id,
    },
    onSuccess: (res) => console.log(res),
  });

  return (
    <div>
      <h1>{item.title}</h1>
      <h4>{item.price} EUR</h4>
      {errors}
      <button onClick={submitRequest} className="btn btn-primary">
        Buy
      </button>
    </div>
  );
};

itemDisplay.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/items/${itemId}`);

  return { item: data };
};

export default itemDisplay;
