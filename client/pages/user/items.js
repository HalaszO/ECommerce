const UserItems = ({ items, currentUser }) => {
  const itemList =
    items === [] ? (
      <div>You don't have any items for sale yet</div>
    ) : (
      <table className="table">
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
        {items.map((item) => {
          return (
            <tr>
              <td>{item.title}</td>
              <td>{item.price} Eur</td>
            </tr>
          );
        })}
      </table>
    );
  return (
    <div>
      <h2 className="my-4">My items</h2>
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
