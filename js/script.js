const cities = [
  "Barreiras",
  "Luís Eduardo Magalhães",
  "Angical",
  "Baianópolis",
  "Bom Jesus da Lapa",
  "Brejolândia",
  "Canápolis",
  "Catolândia",
  "Cocos",
  "Coribe",
  "Correntina",
  "Cotegipe",
  "Cristópolis",
  "Formosa do Rio Preto",
  "Ibotirama",
  "Jaborandi",
  "Mansidão de São Francisco",
  "Paratinga",
  "Riachão das Neves",
  "Santa Maria da Vitória",
  "Santa Rita de Cássia",
  "Santana",
  "São Desidério",
  "São Félix do Coribe",
  "Serra do Ramalho",
  "Serra Dourada",
  "Sítio do Mato",
  "Tabocas do Brejo Velho",
  "Wanderley",
  "Roda Velha"
];

const fleet = [
  { name: "Frota moderna", description: "Veículos novos e bem conservados para uma operação mais segura e profissional." },
  { name: "Compartimento fechado", description: "Cargas protegidas durante coleta, transporte e entrega." },
  { name: "Capacidade versátil", description: "Estrutura preparada para encomendas, coletas, cargas leves e demandas recorrentes." },
  { name: "Rotas planejadas", description: "Atendimento regional organizado para reduzir atrasos e improvisos." },
  { name: "Controle operacional", description: "Comunicação próxima para acompanhar cada etapa da entrega." },
  { name: "Cuidado com a carga", description: "Equipe orientada para preservar integridade, prazo e confiança." }
];

const citiesGrid = document.querySelector("#cities-grid");
if (citiesGrid) {
  citiesGrid.innerHTML = cities.map((city) => `<span>${city}</span>`).join("");
}

const fleetGrid = document.querySelector("#fleet-grid");
if (fleetGrid) {
  fleetGrid.innerHTML = fleet.map((item) => `
    <article class="fleet-card">
      <svg aria-hidden="true"><use href="#icon-truck"></use></svg>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </article>
  `).join("");
}

const themeStorageKey = "ot-theme";
const themeValues = new Set(["system", "light", "dark"]);
const themeLabels = {
  system: "Automático",
  light: "Claro",
  dark: "Escuro"
};
const themePicker = document.querySelector(".theme-picker");
const themeTrigger = document.querySelector("#theme-trigger");
const themeMenu = document.querySelector("#theme-menu");
const themeCurrent = document.querySelector(".theme-current");
const themeOptions = [...document.querySelectorAll(".theme-option")];
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

let themePreference = "system";
try {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme && themeValues.has(savedTheme)) themePreference = savedTheme;
} catch (error) {
  themePreference = "system";
}

const resolveTheme = (preference) => (
  preference === "system"
    ? (systemThemeQuery.matches ? "dark" : "light")
    : preference
);

const applyTheme = (preference, persist = false) => {
  const safePreference = themeValues.has(preference) ? preference : "system";
  const resolvedTheme = resolveTheme(safePreference);
  themePreference = safePreference;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;

  if (themeTrigger) {
    themeTrigger.dataset.themeValue = safePreference;
    themeTrigger.setAttribute("aria-label", `Tema: ${themeLabels[safePreference]}`);
  }
  if (themeCurrent) themeCurrent.textContent = themeLabels[safePreference];
  themeOptions.forEach((option) => {
    option.setAttribute("aria-checked", String(option.dataset.themeValue === safePreference));
  });
  if (themeColor) themeColor.content = resolvedTheme === "dark" ? "#031022" : "#f4f7f9";

  if (persist) {
    try {
      localStorage.setItem(themeStorageKey, safePreference);
    } catch (error) {
      // O tema continua funcionando durante a sessão quando o armazenamento não está disponível.
    }
  }
};

applyTheme(themePreference);

const setThemeMenuState = (isOpen, focusSelected = false) => {
  if (!themeTrigger || !themeMenu) return;
  themeMenu.hidden = !isOpen;
  themeTrigger.setAttribute("aria-expanded", String(isOpen));

  if (isOpen && focusSelected) {
    window.requestAnimationFrame(() => {
      themeOptions.find((option) => option.getAttribute("aria-checked") === "true")?.focus();
    });
  }
};

if (themeTrigger && themeMenu) {
  themeTrigger.addEventListener("click", () => {
    setThemeMenuState(themeMenu.hidden, true);
  });

  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      applyTheme(option.dataset.themeValue, true);
      setThemeMenuState(false);
      themeTrigger.focus();
    });
  });

  themeMenu.addEventListener("keydown", (event) => {
    const currentIndex = themeOptions.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % themeOptions.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + themeOptions.length) % themeOptions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = themeOptions.length - 1;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      themeOptions[nextIndex].focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!themePicker?.contains(event.target)) setThemeMenuState(false);
  });

  themePicker?.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (!themePicker.contains(document.activeElement)) setThemeMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !themeMenu.hidden) {
      setThemeMenuState(false);
      themeTrigger.focus();
    }
  });
}

const handleSystemThemeChange = () => {
  if (themePreference === "system") applyTheme("system");
};

if (typeof systemThemeQuery.addEventListener === "function") {
  systemThemeQuery.addEventListener("change", handleSystemThemeChange);
} else if (typeof systemThemeQuery.addListener === "function") {
  systemThemeQuery.addListener(handleSystemThemeChange);
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

const setMenuState = (isOpen, restoreFocus = false) => {
  if (!menuToggle || !nav) return;
  nav.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  if (isOpen && window.innerWidth <= 1120) {
    window.requestAnimationFrame(() => nav.querySelector("a")?.focus());
  } else if (restoreFocus) {
    menuToggle.focus();
  }
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setMenuState(false, true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setMenuState(false, true);
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (nav.classList.contains("open") && header && !header.contains(event.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120 && nav.classList.contains("open")) setMenuState(false);
  });
}

const updateHeaderState = () => {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const revealElements = document.querySelectorAll(
  "main section, .info-card, .service-card, .fleet-card, .location-card, .client-fit article, .process-grid article, .commitment-grid article"
);
revealElements.forEach((element) => element.classList.add("reveal"));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const observedSections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
