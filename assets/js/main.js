const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const currentPath = window.location.pathname.split("/").pop();

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

if (navLinks) {
  const links = navLinks.querySelectorAll("a[data-page]");
  links.forEach((link) => {
    const page = link.getAttribute("data-page");
    const normalizedPath = currentPath === "" ? "index.html" : currentPath;
    if (normalizedPath === page) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("click", (event) => {
  if (!navLinks || !menuToggle) return;
  const isClickInsideNav = navLinks.contains(event.target) || menuToggle.contains(event.target);
  if (!isClickInsideNav) {
    navLinks.classList.remove("open");
  }
});

