import Router from "next/router";

const UserOrders = ({ orders, currentUser }) => {
  // Redirect if not logged in
  if (!currentUser) return Router.push("/auth/login");

  const orderList =
    orders.length === 0 ? (
      <div className="container-subtitle">
        You haven't made any purchases yet. Go, buy something for yourself!
      </div>
    ) : (
      <table className="table">
        <tr>
          <th>Item name</th>
          <th>Price</th>
          <th>Order status</th>
        </tr>
        {orders.map((order) => {
          return (
            <tr key={order.id}>
              <td>{order.item.title}</td>
              <td>{order.item.price} Eur</td>
              <td>{order.status}</td>
            </tr>
          );
        })}
      </table>
    );
  return (
    <div>
      <h2 className="my-4 container-title">My orders</h2>
      {orderList}
    </div>
  );
};

UserOrders.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default UserOrders;
