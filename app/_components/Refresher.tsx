import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { refreshAction } from "../_actions/refresh";

const Refresher = () => {
  const { user, setUser, logOut } = useAuthStore();

  useEffect(() => {
    if (user) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await refreshAction();

        if (cancelled) return;

        if (result.success && result.data?.user) {
          setUser(result.data.user);
        } else {
          logOut();
        }
      } catch {
        if (!cancelled) logOut();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, setUser, logOut]);
  return null;
};

export default Refresher;
