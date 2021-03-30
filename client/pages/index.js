import { useEffect } from "react";
import Router from "next/router";

const LandingPage = ({ currentUser }) => {
  useEffect(() => {
    if (currentUser) {
      // if signed in, redirect to the items-page
      Router.push("/items");
    } else {
      // if not, prompt sign-in
      setTimeout(() => Router.push("/auth/signin"), 2000);
    }
  }, [currentUser]);

  const redirectMessage = (
    <div className="container">
      <h1>You are not signed in yet</h1>
      <h6>The browser redirects you to the sign-in page shortly</h6>
    </div>
  );
  return <div>{!currentUser && redirectMessage}</div>;
};

export default LandingPage;
