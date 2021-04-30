import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submitRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await submitRequest();
  };

  return (
    <div className="account-form-container">
      <form className="account-form" onSubmit={onSubmit}>
        <div className="my-3 text-center">
          <h1 className="font-weight-bolder">Register</h1>
          <p>Sign up here for an account</p>
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control px-3"
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control px-3"
            placeholder="Password"
          />
        </div>
        {errors}
        <button className="btn btn-primary btn-login align-self-center">
          Register now
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
