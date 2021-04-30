import Link from "next/link";
const ItemsDisplay = ({ items }) => {
  // check which items are not currently reserved
  const availableItems = items.filter((item) => {
    return !item.orderId;
  });

  const itemList =
    availableItems.length === 0 ? (
      <div className="container-subtitle">
        No items are available at this time. Check back later!
      </div>
    ) : (
      <div className="item-list">
        {availableItems.map((item) => {
          return (
            <div
              key={item.id}
              className="my-2 mx-4 px-4 py-4 border-bottom row product-card"
            >
              <div className="col-sm-6 align-self-center product-title">
                {item.title}
              </div>
              <div className="col-sm-4 align-self-center product-price">
                {item.price} EUR
              </div>
              <div className="col-sm-2 product-view-btn">
                <Link href="/items/[id]" as={`/items/${item.id}`}>
                  <a className="btn btn-primary">View</a>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );

  return (
    <div className="container-md">
      <div className="container-title my-4 mx-4">
        Items
        <span className="container-subtitle mx-2">
          ({availableItems.length} items)
        </span>
      </div>
      {itemList}
    </div>
  );
};

ItemsDisplay.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/items");
  return { items: data };
};

export default ItemsDisplay;
