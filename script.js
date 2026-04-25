const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-link");
const revealEls = document.querySelectorAll(".reveal");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const typingText = document.getElementById("typingText");
const repoGrid = document.getElementById("repoGrid");

const phrases = [
  "Building Digital Solutions",
  "Optimizing Backend Systems",
  "Creating Scalable Web Apps",
  "Delivering Better User Experiences"
];

let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  typingText.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);
  if (!deleting && charIndex > current.length) {
    deleting = true;
    setTimeout(typeLoop, 1100);
    return;
  }
  if (deleting && charIndex < 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    charIndex = 0;
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
typeLoop();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", current === "dark" ? "light" : "dark");
  if (current === "dark") document.documentElement.removeAttribute("data-theme");
});

menuToggle.addEventListener("click", () => nav.classList.toggle("open"));

navLinks.forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "block" : "none";
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      if (entry.target.classList.contains("skill-item")) {
        const bar = entry.target.querySelector(".bar i");
        bar.style.width = bar.dataset.width + "%";
      }
      if (entry.target.classList.contains("stat-card")) animateCounter(entry.target.querySelector(".stat-number"));
    }
  });
}, { threshold: 0.18 });

revealEls.forEach(el => observer.observe(el));

document.querySelectorAll(".stat-card").forEach(el => observer.observe(el));

function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = target >= 1000 ? current.toLocaleString() : current;
  }, 20);
}

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("main section[id]");
  let currentId = "";
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) currentId = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
});

async function loadRepos() {
  try {
    const res = await fetch("https://api.github.com/users/spurushotham0719/repos?sort=updated&per_page=6");
    const repos = await res.json();
    repoGrid.innerHTML = repos.slice(0, 6).map(repo => `
      <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description provided."}</p>
        <div class="repo-meta">
          <span>★ ${repo.stargazers_count}</span>
          <span>GitHub</span>
        </div>
      </a>
    `).join("");
  } catch (e) {
    repoGrid.innerHTML = `<div class="repo-skeleton">Unable to load repositories right now.</div>`;
  }
}
loadRepos();

document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks for reaching out! This form is ready to connect to your backend/email service.");
});