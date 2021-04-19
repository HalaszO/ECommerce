import { useEffect } from "react";
import Router from "next/router";

const LandingPage = ({ currentUser }) => {
  useEffect(() => {
    if (currentUser) {
      // if signed in, redirect to the items-page
      Router.push("/items");
    } else {
      // if not, prompt sign-in
      setTimeout(() => Router.push("/auth/signin"), 1000);
    }
  }, [currentUser]);

  const redirectMessage = (
    <div
      className="container-md d-flex flex-column justify-content-center 
    container-redirect"
    >
      <div className="align-self-center">
        <h2>You are not signed in yet</h2>
      </div>
      <div className="align-self-center">
        The browser redirects you to the sign-in page shortly
      </div>
    </div>
  );
  return <div>{!currentUser && redirectMessage}</div>;
};

export default LandingPage;
