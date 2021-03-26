import { useEffect } from "react";
import Router from "next/router";
import Link from "next/link";

const LandingPage = ({ currentUser, items }) => {
  // Redriect to sign-in page if not signed in
  useEffect(() => {
    if (!currentUser) {
      setTimeout(async () => await Router.push("/auth/signin"), 3000);
    }
  }, [currentUser]);

  const welcomeMessage = currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <div>
      <h1>You are not signed in yet</h1>
      <h6>The browser redirects you to the sign-in page shortly</h6>
    </div>
  );

  console.log(Object.values(items));
  console.log(currentUser);

  // check which items are not currently reserved
  const availableItems = items.filter((item) => {
    return !item.orderId;
  });

  console.log(Object.values(availableItems));

  const itemList = (
    <div className="my-0 d-flex flex-wrap">
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
      {welcomeMessage}
      <h1>Items</h1>
      {itemList}
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/items");
  return { items: data };
};

export default LandingPage;
