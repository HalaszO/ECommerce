import axios from "axios";

const buildClient = ({ req }) => {
  // Deciding whether we are on the server or the client
  if (typeof window === "undefined") {
    // server
    let baseURL;
    if (process.env.CLUSTER_ENV === "prd") {
      // prod ingress domain
      baseURL = "https://www.ecommerce-app-prd.xyz/";
    } else {
      // dev and default (local development cluster)
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

export default buildClient;
