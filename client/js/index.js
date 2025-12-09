document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".fade");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => observer.observe(card));
});
