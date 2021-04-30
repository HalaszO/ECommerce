import Link from "next/link";
import Logo from "./logo";

export default function HeaderComponent({ currentUser }) {
  const links = [
    !currentUser && { label: "Register", href: "/auth/register" },
    !currentUser && { label: "Log in", href: "/auth/login" },
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

  const brandName = (
    <Link href="/">
      <a className="navbar-brand">
        Ecommerce
        <Logo className="ml-2 font-weight-500" />
      </a>
    </Link>
  );

  const greetingMessage = currentUser && (
    <div className="user-greet">Hello there, {currentUser.email}!</div>
  );

  return (
    <nav className="navbar navbar-fixed-top navbar-dark flex-column flex-md-row">
      {brandName}
      {greetingMessage}
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
}
