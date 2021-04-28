import axios from "axios";

const buildClientFromCtx = ({ req }) => {
  // Deciding whether we are on the server or the client
  if (typeof window === "undefined") {
    // server
    let baseURL;
    if (process.env.CLUSTER_ENV === "prd") {
      // prod ingress domain
      baseURL = "https://www.ecommerce-app-prd.xyz/";
    } else {
      // dev and default
      baseURL = "http://ingress-nginx-srv";
    }
    return axios.create({
      baseURL,
      headers: req.headers,
    });
  } else {
    // client
    return axios.create({
      baseURL: "/",
    });
  }
};

// To-do: extract domains to config file

export default buildClientFromCtx;
