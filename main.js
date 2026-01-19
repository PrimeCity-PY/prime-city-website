(() => {
  const header = document.querySelector("[data-elevate]");
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");

  // Header elevation on scroll
  const setHeader = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 10);
  };
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  // Mobile nav
  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const openNav = () => {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) closeNav();
      else openNav();
    });

    nav.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const a = t.closest("a");
      if (a) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.closest(".nav") || t.closest(".nav-toggle")) return;
      closeNav();
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  for (const el of revealEls) io.observe(el);

  // Year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Back to top
  const topBtn = document.querySelector("[data-top]");
  if (topBtn) {
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Count-up stats (once visible)
  const statNums = Array.from(document.querySelectorAll("[data-count]"));
  const animateCount = (el) => {
    const to = Number(el.getAttribute("data-count") || "0");
    const start = 0;
    const duration = 900;
    const startAt = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(start + (to - start) * eased);
      el.textContent = String(val) + (to >= 100 ? "k+" : "+");
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const ioStats = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          ioStats.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 }
  );
  for (const el of statNums) ioStats.observe(el);
})();

