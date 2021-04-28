import useSWR from "swr";
import useUser from "../../hooks/useUser";
import swrFetcher from "../../api/swrFetcher";

const UserOrders = () => {
  // Auth
  const { user } = useUser({ redirectTo: "/auth/login" });
  // Data fetch
  const { data: orders } = useSWR(`/api/orders`, swrFetcher);

  if (!user || !orders) {
    return <div className="container-subtitle">Loading...</div>;
  }

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

export default UserOrders;
