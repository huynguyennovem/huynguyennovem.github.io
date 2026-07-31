/* Lightweight replacement for jquery + sphinx_rtd_theme nav (mobile toggle, tables). */
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    document.addEventListener("click", function (event) {
      var toggle = event.target.closest("[data-toggle='wy-nav-top']");
      if (!toggle) {
        return;
      }
      event.preventDefault();
      document.querySelectorAll("[data-toggle='wy-nav-shift']").forEach(function (el) {
        el.classList.toggle("shift");
      });
    });

    document.querySelectorAll(".wy-menu-vertical .toctree-l1 > a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.querySelectorAll("[data-toggle='wy-nav-shift'].shift").forEach(function (el) {
          el.classList.remove("shift");
        });
      });
    });

    document.querySelectorAll("div.rst-content table").forEach(function (table) {
      table.classList.add("docutils");
      if (
        table.classList.contains("field-list") ||
        table.classList.contains("footnote") ||
        table.classList.contains("citation")
      ) {
        return;
      }
      if (table.parentElement && table.parentElement.classList.contains("wy-table-responsive")) {
        return;
      }
      var wrap = document.createElement("div");
      wrap.className = "wy-table-responsive";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  });
})();
