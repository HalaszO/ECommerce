import Error from "next/error";
import PropTypes from "prop-types";

function ErrorPage({ statusCode }) {
  return <Error statusCode={statusCode}></Error>;
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

ErrorPage.propTypes = {
  statusCode: PropTypes.number,
};

export default ErrorPage;
