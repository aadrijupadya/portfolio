const root = document.documentElement;
const navCollection = document.querySelector(".page-links");
const currentPath = window.location.pathname.split("/").pop() || "index.html";

if (navCollection) {
  const links = navCollection.querySelectorAll("a[data-page]");
  links.forEach((link) => {
    const targetPage = link.getAttribute("data-page");
    if (targetPage === currentPath) {
      link.classList.add("active");
    }
  });
}

function initWaveBackground() {
  const canvas = document.createElement("canvas");
  canvas.className = "wave-canvas";
  document.body.prepend(canvas);

  const context = canvas.getContext("2d");
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const getCurrentTheme = () =>
    root.getAttribute("data-theme") === "dark" ? "dark" : "light";

  const createWaves = (theme) => {
    const palette =
      theme === "dark"
        ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.04)"]
        : ["rgba(17, 17, 17, 0.07)", "rgba(17, 17, 17, 0.05)", "rgba(17, 17, 17, 0.035)"];
    return [
      {
        amplitude: 22,
        wavelength: 240,
        speed: 0.0016,
        verticalShift: 0.45,
        color: palette[0],
        phase: 0,
      },
      {
        amplitude: 30,
        wavelength: 320,
        speed: 0.0011,
        verticalShift: 0.55,
        color: palette[1],
        phase: Math.PI / 2,
      },
      {
        amplitude: 18,
        wavelength: 180,
        speed: 0.002,
        verticalShift: 0.6,
        color: palette[2],
        phase: Math.PI,
      },
    ];
  };

  let waves = createWaves(getCurrentTheme());

  function resizeCanvas() {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);
  }

  let lastTimestamp = 0;

  function drawWaves(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    context.clearRect(0, 0, width, height);

    waves.forEach((wave) => {
      wave.phase += wave.speed * deltaTime;

      context.beginPath();
      context.moveTo(0, height);

      for (let x = 0; x <= width; x += 8) {
        const normalized = (x / wave.wavelength) + wave.phase;
        const y =
          Math.sin(normalized) * wave.amplitude +
          height * wave.verticalShift;
        context.lineTo(x, y);
      }

      context.lineTo(width, height);
      context.closePath();
      context.fillStyle = wave.color;
      context.fill();
    });

    requestAnimationFrame(drawWaves);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(drawWaves);

  window.__updateWavePalette = (theme) => {
    waves = createWaves(theme);
  };
}

initWaveBackground();

function initThemeToggle() {
  const toggleButtons = document.querySelectorAll(".theme-toggle");
  if (!toggleButtons.length) return;
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  }

  const updateWavePalette = () => {
    const theme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    if (typeof window.__updateWavePalette === "function") {
      window.__updateWavePalette(theme);
    }
  };

  const setLabel = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    toggleButtons.forEach((button) => {
      const icon = button.querySelector(".icon-moon");
      if (icon) {
        icon.textContent = isDark ? "☀︎" : "☾";
      }
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
  };

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
      setLabel();
      updateWavePalette();
    });
  });

  setLabel();
  updateWavePalette();
}

initThemeToggle();

