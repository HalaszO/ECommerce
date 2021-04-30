import Router from "next/router";

const UserItems = ({ items, currentUser }) => {
  // Redirect if not logged in
  if (!currentUser) return Router.push("/auth/login");

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

UserItems.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/items?user=${currentUser.id}`);
  console.log(JSON.stringify(data));
  return { items: data };
};

export default UserItems;
