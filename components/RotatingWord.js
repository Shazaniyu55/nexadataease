import { useEffect, useState } from "react";

export default function RotatingWord({ words, interval = 2200, className = "" }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || words.length < 2) return undefined;

    const timer = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 280);
      return () => clearTimeout(swap);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span
      className={`inline-block min-w-[1ch] transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
      } ${className}`}
    >
      {words[index]}
    </span>
  );
}
