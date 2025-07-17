import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your backend URL in prod
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
