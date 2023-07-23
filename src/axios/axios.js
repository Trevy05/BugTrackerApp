import axios from "axios";

const instance = axios.create({
  baseURL: "https://your-api-url.com",
});

instance.interceptors.response.use(
  (response) => {
    // Log activity here
    console.log(
      "Activity logged:",
      response.config.method,
      response.config.url
    );
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
