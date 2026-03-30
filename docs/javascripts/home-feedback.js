document.addEventListener("DOMContentLoaded", () => {
  const strips = document.querySelectorAll(".feedback-strip");

  for (const strip of strips) {
    const cards = Array.from(strip.querySelectorAll(".feedback-card"));
    if (cards.length === 0) {
      continue;
    }

    const defaultCard =
      strip.querySelector(".feedback-card--default") ?? cards[0];

    const setActiveCard = (nextCard) => {
      for (const card of cards) {
        card.classList.toggle("is-active", card === nextCard);
      }
    };

    setActiveCard(defaultCard);

    for (const card of cards) {
      const activate = () => setActiveCard(card);
      const summary = card.querySelector(".feedback-card__summary");
      const body = card.querySelector(".feedback-card__body");

      for (const target of [card, summary, body]) {
        if (!target) {
          continue;
        }

        target.addEventListener("pointerenter", activate);
        target.addEventListener("focusin", activate);
      }
    }

    strip.addEventListener("pointerleave", () => {
      setActiveCard(defaultCard);
    });

    strip.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!strip.contains(document.activeElement)) {
          setActiveCard(defaultCard);
        }
      });
    });
  }
});
