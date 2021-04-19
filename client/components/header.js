import Link from "next/link";

const HeaderComponent = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Register", href: "/auth/signup" },
    !currentUser && { label: "Log in", href: "/auth/signin" },
    currentUser && { label: "Sell an item", href: "/items/create" },
    currentUser && { label: "My items", href: "/user/items" },
    currentUser && { label: "My orders", href: "/user/orders" },
    currentUser && { label: "Sign out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-fixed-top navbar-dark flex-column flex-md-row">
      <Link href="/">
        <a className="navbar-brand">Ecommerce</a>
      </Link>
      {currentUser && (
        <div className="user-greet">Hello there, {currentUser.email}!</div>
      )}
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default HeaderComponent;
