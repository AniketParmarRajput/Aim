"use client";

import { useEffect, useRef, useState } from "react";

const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  distance = 24,
  className = "",
  as: Tag = "div",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    direction === "up"
      ? `translateY(${distance}px)`
      : direction === "down"
      ? `translateY(-${distance}px)`
      : direction === "left"
      ? `translateX(-${distance}px)`
      : direction === "right"
      ? `translateX(${distance}px)`
      : direction === "scale"
      ? "scale(0.9)"
      : "none";

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : hiddenTransform,
        transition: `opacity 2s ease-out ${delay}s, transform 2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;