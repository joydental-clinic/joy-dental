"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const selector = ".fade-in, .fade-in-left, .fade-in-right";

    function observeAll() {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains("visible")) {
          observer.observe(el);
        }
      });
    }

    observeAll();

    // Watch for new elements added after client-side navigation
    const mutation = new MutationObserver(() => observeAll());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
