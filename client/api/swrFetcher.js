import axios from "axios";

const swrFetcher = async (url) => {
  try {
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.error(error);
  }
};

export default swrFetcher;
