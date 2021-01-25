import { useEffect } from "react";
import Router from "next/router";
import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  // Redriect to sign-in page if not signed in
  useEffect(() => {
    if (!currentUser) {
      setTimeout(async () => await Router.push("/auth/signin"), 3000);
    }
  }, [currentUser]);

  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <div>
      <h1>You are not signed in yet</h1>
      <h6>The browser redirects you to the sign-in page shortly</h6>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
