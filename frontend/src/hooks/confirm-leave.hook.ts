import { useRouter } from "next/router";
import { useEffect } from "react";

const useConfirmLeave = ({
  message,
  enabled,
}: {
  message: string;
  enabled: boolean;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    // Show confirmation dialog when route changes
    const handleRouteChange = () => {
      const confirmLeave = window.confirm(message);
      if (!confirmLeave) {
        router.events.emit("routeChangeError");
        throw "Route change aborted.";
      }
    };

    // Show confirmation when the user tries to leave or reload the page
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router, message, enabled]);
};

export default useConfirmLeave;
