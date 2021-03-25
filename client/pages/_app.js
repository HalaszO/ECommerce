import "bootstrap/dist/css/bootstrap.css";
import buildClientFromCtx from "../api/buildClientFromCtx";
import Header from "../components/header";

const appComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

appComponent.getInitialProps = async (appContext) => {
  const client = buildClientFromCtx(appContext.ctx); // ctx: (req, res); Getting client based on context (browser or server)

  const { data } = await client.get("/api/users/currentuser"); // currentUser is passed to all components as initial props

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    // Checking if inital props are required for the component
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
