import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

export default () => {
  const { submitRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => setTimeout(async () => await Router.push("/"), 1000),
  });
  useEffect(() => {
    submitRequest();
  }, []);
  return (
    <div className="d-flex display-column justify-content-center">
      <h4>Signing you out...</h4>
    </div>
  );
};
