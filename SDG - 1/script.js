// ============================================
// SDG 1 – No Poverty | Simple JavaScript
// Concepts: DOM, events, arrays, objects, map
// ============================================

"use strict";

// ===== TOP SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = progress + "%";
});

// ===== SMOOTH SCROLL for Learn More button =====
document.getElementById("learn-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("about").scrollIntoView({ behavior: "smooth" });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu when a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ===== BACK TO TOP BUTTON =====
const backTop = document.getElementById("back-top");

window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 400);
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== FADE-IN ON SCROLL =====
// Uses IntersectionObserver to add "visible" class when elements appear
const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

fadeElements.forEach((el) => observer.observe(el));

// ===== CAUSES OF POVERTY =====
// Data stored as an array of objects
const causesData = [
  {
    icon: "fas fa-briefcase",
    title: "Unemployment",
    detail: "Without jobs, families cannot afford food, shelter, or healthcare — trapping them in poverty.",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Lack of Education",
    detail: "Education is the strongest tool to break poverty. Without it, better opportunities remain out of reach.",
  },
  {
    icon: "fas fa-cloud-showers-heavy",
    title: "Natural Disasters",
    detail: "Floods, droughts, and earthquakes destroy livelihoods. Vulnerable communities struggle to recover.",
  },
  {
    icon: "fas fa-bomb",
    title: "Conflict & War",
    detail: "Armed conflicts displace millions, destroy infrastructure, and halt economic growth.",
  },
  {
    icon: "fas fa-chart-line",
    title: "Inflation",
    detail: "Rising prices reduce purchasing power, making basic necessities unaffordable for the poor.",
  },
  {
    icon: "fas fa-hospital",
    title: "Lack of Healthcare",
    detail: "Medical emergencies can bankrupt families. Illness reduces earning capacity and deepens poverty.",
  },
];

// Render cause cards using map() and template literals
const causesGrid = document.getElementById("causes-grid");

causesGrid.innerHTML = causesData
  .map(
    (cause) => `
    <div class="cause-card">
      <div class="cause-header">
        <div class="cause-icon"><i class="${cause.icon}"></i></div>
        <h3>${cause.title}</h3>
        <span class="cause-toggle"><i class="fas fa-chevron-down"></i></span>
      </div>
      <div class="cause-detail">
        <p>${cause.detail}</p>
      </div>
    </div>`
  )
  .join("");

// Toggle expand/collapse on click using classList.toggle()
causesGrid.querySelectorAll(".cause-card").forEach((card) => {
  card.addEventListener("click", () => {
    // Close others first
    causesGrid.querySelectorAll(".cause-card").forEach((c) => {
      if (c !== card) c.classList.remove("open");
    });
    card.classList.toggle("open");
  });
});

// ===== SOLUTIONS =====
// Array of solution objects rendered dynamically
const solutionsData = [
  { icon: "fas fa-book-open", title: "Education", desc: "Empowers people with skills to escape poverty." },
  { icon: "fas fa-briefcase", title: "Jobs", desc: "Stable employment provides financial security." },
  { icon: "fas fa-tint", title: "Clean Water", desc: "Improves health and productivity in communities." },
  { icon: "fas fa-female", title: "Women Empowerment", desc: "Gender equality drives economic growth." },
  { icon: "fas fa-landmark", title: "Government Aid", desc: "Social safety nets protect the vulnerable." },
];

const solGrid = document.getElementById("solutions-grid");

solGrid.innerHTML = solutionsData
  .map(
    (sol) => `
    <div class="sol-card">
      <i class="${sol.icon}"></i>
      <h3>${sol.title}</h3>
      <p>${sol.desc}</p>
    </div>`
  )
  .join("");

// ===== QUIZ =====
// Quiz data: array of question objects
const quizData = [
  {
    question: "What does SDG 1 aim to achieve?",
    options: ["End hunger", "End poverty in all forms", "Clean energy", "Quality education"],
    correct: 1,
  },
  {
    question: "How many people live in extreme poverty?",
    options: ["100 million", "300 million", "700+ million", "2 billion"],
    correct: 2,
  },
  {
    question: "What is the UN target year to end poverty?",
    options: ["2025", "2030", "2040", "2050"],
    correct: 1,
  },
  {
    question: "Which is a major cause of poverty?",
    options: ["Too much education", "Unemployment", "Low population", "Excess healthcare"],
    correct: 1,
  },
];

let current = 0; // current question index
let score = 0;   // user score

const qQuestion = document.getElementById("quiz-question");
const qOptions = document.getElementById("quiz-options");
const qNext = document.getElementById("quiz-next");
const qCounter = document.getElementById("quiz-counter");
const qBar = document.getElementById("quiz-bar");
const qBox = document.getElementById("quiz-box");
const qResult = document.getElementById("quiz-result");

// Function to load a question into the DOM
const loadQuestion = () => {
  const q = quizData[current];
  qCounter.textContent = `Question ${current + 1} of ${quizData.length}`;
  qBar.style.width = ((current + 1) / quizData.length) * 100 + "%";
  qQuestion.textContent = q.question;
  qNext.disabled = true;

  // Render options as buttons using map()
  qOptions.innerHTML = q.options
    .map((opt, i) => `<button class="quiz-opt" data-i="${i}">${opt}</button>`)
    .join("");

  // Add click event to each option
  qOptions.querySelectorAll(".quiz-opt").forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(btn));
  });
};

// Handle answer selection
const selectAnswer = (btn) => {
  const picked = parseInt(btn.dataset.i);
  const correct = quizData[current].correct;

  // Disable all options after selection
  qOptions.querySelectorAll(".quiz-opt").forEach((b) => {
    b.disabled = true;
    if (parseInt(b.dataset.i) === correct) b.classList.add("correct");
    if (parseInt(b.dataset.i) === picked && picked !== correct) b.classList.add("wrong");
  });

  if (picked === correct) score++;

  qNext.disabled = false;
  qNext.textContent = current === quizData.length - 1 ? "See Results" : "Next →";
};

// Next button handler
qNext.addEventListener("click", () => {
  current++;
  if (current < quizData.length) {
    loadQuestion();
  } else {
    // Show results
    qBox.style.display = "none";
    qResult.style.display = "block";

    const emoji = document.getElementById("result-emoji");
    const title = document.getElementById("result-title");
    const scoreEl = document.getElementById("result-score");

    scoreEl.textContent = `${score} / ${quizData.length}`;

    if (score >= 3) {
      emoji.textContent = "🏆";
      title.textContent = "Excellent!";
    } else if (score >= 2) {
      emoji.textContent = "👍";
      title.textContent = "Good Job!";
    } else {
      emoji.textContent = "📚";
      title.textContent = "Keep Learning!";
    }
  }
});

// Restart quiz
document.getElementById("quiz-restart").addEventListener("click", () => {
  current = 0;
  score = 0;
  qBox.style.display = "block";
  qResult.style.display = "none";
  loadQuestion();
});

// Initialize quiz on page load
loadQuestion();
