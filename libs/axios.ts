import axios from "axios";

const api = axios.create({
  baseURL: "https://famlinkapi.onrender.com/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
