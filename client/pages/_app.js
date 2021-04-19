import "bootstrap/dist/css/bootstrap.css";
import "../styles/css/global.css";
import buildClientFromCtx from "../api/buildClientFromCtx";
import Header from "../components/header";

const appComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="app-container">
      <Header currentUser={currentUser} />
      <div className="container-md my-4">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

appComponent.getInitialProps = async (appContext) => {
  const client = buildClientFromCtx(appContext.ctx); // ctx: (req, res); Getting client based on context (browser or server)

  const { data } = await client.get("/api/users/currentuser"); // currentUser is passed to all components as initial props
  console.log(`Current user: ${JSON.stringify(data.currentUser)}`);
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
