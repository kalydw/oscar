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

document.querySelectorAll("section, .info-card, .service-card, .fleet-card, .location-card, .client-fit article, .process-grid article, .commitment-grid article").forEach((element) => {
  element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("is-visible", entry.isIntersecting);
  });
}, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const observedSections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
observedSections.forEach((section) => observer.observe(section));

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
