import axios from "axios";

const axiosService = axios.create({
  // baseURL: "http://localhost:4000/",
  baseURL: "https://485d-196-207-182-190.ap.ngrok.io",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = async (instance) => {
  const { token } = await JSON.parse(localStorage.getItem("userInfo"));
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

// singleton instance
export default axiosService;
