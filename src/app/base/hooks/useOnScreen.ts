import type { RefObject } from "react";
import { useEffect, useMemo, useState } from "react";

export default function useOnScreen(ref: RefObject<Element>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    if (typeof IntersectionObserver !== "undefined")
      return new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
      );
  }, []);

  useEffect(() => {
    if (ref.current) observer?.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer?.disconnect();
    };
  }, [observer, ref]);

  return isIntersecting;
}
