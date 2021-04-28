import useSWR from "swr";
import useUser from "../../hooks/useUser";
import swrFetcher from "../../api/swrFetcher";

const UserItems = () => {
  const { user } = useUser({ redirectTo: "/auth/login" });
  const { data: items } = useSWR(`/api/items?user=${user.id}`, swrFetcher);
  // If data or user is not there (yet), display loading screen
  if (!user || !items) {
    return <div className="container-subtitle">Loading...</div>;
  }

  const itemList =
    items.length === 0 ? (
      <div className="container-subtitle">
        You don't have any items for sale yet.
      </div>
    ) : (
      <table className="table">
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
        {items.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.price} Eur</td>
            </tr>
          );
        })}
      </table>
    );
  return (
    <div>
      <h2 className="my-4 container-title">My items</h2>
      {itemList}
    </div>
  );
};

export default UserItems;
