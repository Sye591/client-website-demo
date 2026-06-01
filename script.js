const siteState = {
  countersStarted: false,
};

const header = document.querySelector("[data-scroll-header]");
const nav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
}

function animateCounter(element) {
  const target = Number(element.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = Math.round(target * eased).toString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (siteState.countersStarted) return;
    const visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) return;
    siteState.countersStarted = true;
    counters.forEach(animateCounter);
    counterObserver.disconnect();
  },
  { threshold: 0.4 }
);

revealItems.forEach((item) => revealObserver.observe(item));
counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".magnet").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

async function loadStructuredContent() {
  try {
    const response = await fetch("data/site-data.json");
    if (!response.ok) return;
    const data = await response.json();
    document.documentElement.dataset.businessName = data.business.name;
  } catch (error) {
    console.info("Structured site data is available for CMS or database integration.");
  }
}

loadStructuredContent();
