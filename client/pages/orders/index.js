const OrdersDisplay = ({ orders, currentUser }) => {
  const orderList = (
    <div>
      <h2 className="my-4">Orders</h2>
      <table className="table">
        <tr>
          <th>Item name</th>
          <th>Price</th>
          <th>Order status</th>
        </tr>
        {orders.map((order) => {
          return (
            <tr>
              <td>{order.item.title}</td>
              <td>{order.item.price} Eur</td>
              <td>{order.status}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
  return orderList;
};

OrdersDisplay.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrdersDisplay;
