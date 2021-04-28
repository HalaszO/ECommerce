import axios from "axios";

const fetchFromServer = (url, headers = {}) => {
  let baseURL;
  if (process.env.CLUSTER_ENV === "prd") {
    // prod ingress domain
    baseURL = "https://www.ecommerce-app-prd.xyz";
  } else {
    // dev and default
    baseURL = "http://ingress-nginx-srv";
  }
  return axios.get(url, {
    baseURL,
    headers,
  });
};

// To-do: extract domains to config file

export default fetchFromServer;
