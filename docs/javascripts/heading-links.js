document.addEventListener("DOMContentLoaded", () => {
  const headings = document.querySelectorAll(
    ".rst-content h1[id], .rst-content h2[id], .rst-content h3[id], .rst-content h4[id], .rst-content h5[id], .rst-content h6[id]"
  );

  const copyFallback = (text) => {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "absolute";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(input);
    return copied;
  };

  for (const heading of headings) {
    if (heading.querySelector(".section-copy-link")) {
      continue;
    }

    const previous = heading.previousElementSibling;
    const targetId =
      previous &&
      previous.classList.contains("section-anchor-target") &&
      previous.id
        ? previous.id
        : heading.id;
    const headingLabel = heading.textContent.trim();
    const link = document.createElement("a");
    link.className = "section-copy-link";
    link.href = `#${targetId}`;
    link.textContent = "#";
    link.title = "Copy direct link";
    link.setAttribute("aria-label", `Copy direct link to ${headingLabel}`);

    let resetTimer = null;

    link.addEventListener("click", async (event) => {
      event.preventDefault();

      const url = new URL(window.location.href);
      url.hash = targetId;
      history.replaceState(null, "", `#${targetId}`);

      let copied = false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url.toString());
          copied = true;
        } catch (error) {
          copied = copyFallback(url.toString());
        }
      } else {
        copied = copyFallback(url.toString());
      }

      link.classList.add("is-copied");
      link.title = copied ? "Copied direct link" : "Direct link ready";

      if (resetTimer) {
        window.clearTimeout(resetTimer);
      }

      resetTimer = window.setTimeout(() => {
        link.classList.remove("is-copied");
        link.title = "Copy direct link";
      }, 1600);
    });

    heading.appendChild(link);
  }
});
