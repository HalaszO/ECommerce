import Head from "next/head";
import PropTypes from "prop-types";
import "../styles/scss/global.scss";
import buildClient from "../api/buildClient";
import Header from "../components/header";

AppComponent.propTypes = {
  currentUser: {
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  },
  pageProps: PropTypes.object,
  Component: PropTypes.elementType,
};

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <title>Ecommerce. Sell and buy items!</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="app-container">
        <Header currentUser={currentUser} />
        <div className="container-md my-4">
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //Getting client based on context (browser or server)
  // ctx: (req, res);
  const client = buildClient(appContext.ctx);
  // currentUser is passed to all components as initial props
  const {
    data: { currentUser },
  } = await client.get("/api/users/currentuser");
  //const appProps = await App.getInitialProps(appContext);

  let pageProps = {};
  // Checking if initial props are needed for the component
  // If so, we manually call the getInitialProps of the component to pass the client
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      currentUser
    );
  }

  return {
    pageProps,
    currentUser,
  };
};

export default AppComponent;
