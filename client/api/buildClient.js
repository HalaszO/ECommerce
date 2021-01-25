import axios from "axios";

export default ({ req }) => {
  // Deciding whether we are on the server or the client
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://ingress-nginx-srv",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};
