import Link from "next/link";

const HeaderComponent = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign up", href: "/auth/signup" },
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    currentUser && { label: "Sell an item", href: "/items/create" },
    currentUser && { label: "My items", href: "/user/items" },
    currentUser && { label: "My orders", href: "/orders" },
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
    <nav className="navbar navbar-light bg-light shadow-sm">
      <Link href="/">
        <a className="navbar-brand">Ecommerce</a>
      </Link>
      {currentUser && <div>Hello there, {currentUser.email}!</div>}
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default HeaderComponent;
