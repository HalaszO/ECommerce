import axios from "axios";

const buildClientFromCtx = ({ req }) => {
  // Deciding whether we are on the server or the client
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://www.ecommerce-app-prd.xyz/",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClientFromCtx;
