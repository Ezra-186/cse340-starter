const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("primary-nav");

if (toggle && nav) {
  const icon = toggle.querySelector(".nav-toggle-icon");
  const srText = toggle.querySelector(".sr-only");
  const closedIcon = toggle.dataset.iconClosed || "☰";
  const openIcon = toggle.dataset.iconOpen || "✕";

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    if (icon) {
      icon.textContent = expanded ? openIcon : closedIcon;
    }
    if (srText) {
      srText.textContent = expanded ? "Close menu" : "Menu";
    }
  };

  const closeMenu = () => {
    setExpanded(false);
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
