import { getToken } from "@/app/_actions/cookies";
import axios from "axios";

const api = axios.create({
  baseURL: "https://famlinkapi.onrender.com/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
