import Head from "next/head";
import "../styles/css/global.css";
import buildClientFromCtx from "../api/buildClientFromCtx";
import Header from "../components/header";

const appComponent = ({ Component, pageProps, currentUser }) => {
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

//////////////
// The following needs to be removed and the Header element requires a new strategy
//////////////

appComponent.getInitialProps = async (appContext) => {
  //Getting client based on context (browser or server)
  // ctx: (req, res);
  const client = buildClientFromCtx(appContext.ctx);

  // currentUser is passed to all components as initial props
  const { data } = await client.get("/api/users/currentuser");
  console.log(`Current user: ${JSON.stringify(data.currentUser)}`);
  let pageProps = {};
  // Checking if initial props are needed for the component
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default appComponent;
