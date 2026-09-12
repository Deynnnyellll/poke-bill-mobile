import { useEffect, useState } from "react";

export default function useTyper(text, speedMs) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!text) return undefined;

    const intervalId = setInterval(() => {
      setCount((prev) => {
        if (prev >= text.length) {
          clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => clearInterval(intervalId);
  }, [text, speedMs]);

  return text.slice(0, count);
}