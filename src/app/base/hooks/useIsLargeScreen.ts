import { useEffect, useState } from "react";

function useIsLargeScreen(mediaQueryParam?: string) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    setIsLargeScreen(
      window.matchMedia(mediaQueryParam || "(min-width: 1200px)").matches
    );

    // I write this into a function for better visibility
    const handleResize = (e: any) => {
      setIsLargeScreen(e.matches);
    };

    const mediaQuery = window.matchMedia(
      mediaQueryParam || "(min-width: 1200px)"
    );

    mediaQuery.addEventListener("change", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return {
    isLargeScreen,
  };
}

export default useIsLargeScreen;
