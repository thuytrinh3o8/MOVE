
document.addEventListener("DOMContentLoaded", () => {
  // Cuộn nhẹ đến các section khi bấm liên kết nội bộ
  document.querySelectorAll('.home-page a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });

  // Feedback carousel
  const track = document.getElementById("feedbackTrack");
  const prevButton = document.getElementById("feedbackPrev");
  const nextButton = document.getElementById("feedbackNext");
  const dotsContainer = document.getElementById("feedbackDots");

  if (!track || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  const cards = Array.from(track.querySelectorAll(".feedback-card"));
  const dots = Array.from(dotsContainer.querySelectorAll(".feedback-dot"));

  if (cards.length === 0) return;

  let activeIndex = 0;

  function getVisibleCards() {
    if (window.matchMedia("(max-width: 700px)").matches) {
      return 1;
    }

    if (window.matchMedia("(max-width: 1024px)").matches) {
      return 2;
    }

    return 3;
  }

  function updateCarousel() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visibleCards);

    activeIndex = Math.min(activeIndex, maxIndex);

    const card = cards[0];
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap) || 0;
    const cardWidth = card.getBoundingClientRect().width;

    track.style.transform =
      `translateX(-${activeIndex * (cardWidth + gap)}px)`;

    cards.forEach((item, index) => {
      item.classList.toggle("is-current", index === activeIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
      dot.setAttribute(
        "aria-current",
        index === activeIndex ? "true" : "false"
      );
    });

    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex >= maxIndex;

    prevButton.setAttribute(
      "aria-disabled",
      String(prevButton.disabled)
    );

    nextButton.setAttribute(
      "aria-disabled",
      String(nextButton.disabled)
    );
  }

  function goTo(index) {
    const maxIndex = Math.max(0, cards.length - getVisibleCards());

    activeIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }

  prevButton.addEventListener("click", () => {
    goTo(activeIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    goTo(activeIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
    });
  });

  // Tính lại khi đổi kích thước màn hình
  let resizeFrame;

  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);

    resizeFrame = requestAnimationFrame(() => {
      updateCarousel();
    });
  });

  updateCarousel();
});
