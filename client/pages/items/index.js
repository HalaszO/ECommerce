import Link from "next/link";
const ItemsDisplay = ({ items }) => {
  // check which items are not currently reserved
  const availableItems = items.filter((item) => {
    return !item.orderId;
  });

  const itemList = (
    <div className="my-0 card-deck d-flex flex-wrap">
      {availableItems.map((item) => {
        return (
          <div
            key={item.id}
            className="my-4 mx-4 px-4 py-4 border border-info bg-light"
          >
            <h3>{item.title}</h3>
            <h4>Price: {item.price} EUR</h4>

            <Link href="/items/[itemId]" as={`/items/${item.id}`}>
              <a className="badge badge-info">
                <h4>View</h4>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <h1 className="my-4">Items</h1>
      {itemList}
    </div>
  );
};

ItemsDisplay.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/items");
  return { items: data };
};

export default ItemsDisplay;
