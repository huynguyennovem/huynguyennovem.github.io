document.addEventListener("DOMContentLoaded", () => {
  const counter = document.querySelector(".visitor-counter");
  if (!counter) {
    return;
  }

  const endpoint = `/api/visits?path=${encodeURIComponent(location.pathname)}`;
  const storageKey = `vc:${location.pathname}`;

  const hasVisited = () => {
    try {
      return sessionStorage.getItem(storageKey) === "1";
    } catch (error) {
      return false;
    }
  };

  const markVisited = () => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (error) {
      // Storage unavailable: the next load simply counts again.
    }
  };

  const render = (counts) => {
    for (const key of ["page", "site"]) {
      counter.querySelector(`[data-visits="${key}"]`).textContent =
        counts[key].toLocaleString("en-US");
    }
    counter.hidden = false;
  };

  const method = hasVisited() ? "GET" : "POST";

  fetch(endpoint, { method })
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((counts) => {
      render(counts);
      if (method === "POST") {
        markVisited();
      }
    })
    .catch(() => {});
});
