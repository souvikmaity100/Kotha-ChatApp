import { useEffect } from "react";

export const useBackButton = (handler) => {
  useEffect(() => {
    const onPopState = (e) => {
      e.preventDefault();
      handler();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [handler]);
};
