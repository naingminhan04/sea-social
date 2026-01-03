"use client";

import { useEffect } from "react";
import api from "@/libs/axios";

const BackendActivator = () => {
  useEffect(() => {
    const ping = async () => {
        await api.get("/");
    };

    ping();

    const interval = setInterval(ping, 840_000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default BackendActivator;
