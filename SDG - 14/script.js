// --- Progress Tracker ---
window.onscroll = function() { updateProgress() };

function updateProgress() {
    // Calculate how far the user has scrolled
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    // Calculate the total scrollable height
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Calculate the percentage
    const scrolled = (winScroll / height) * 100;
    
    // Update the width of the progress bar
    document.getElementById("myBar").style.width = scrolled + "%";
}

// --- Interactive Quiz ---
const quizData = [
    {
        question: "What percentage of the Earth's surface is covered by oceans?",
        options: ["50%", "60%", "70%", "80%"],
        correct: 2 // Index of "70%"
    },
    {
        question: "How many people depend on marine and coastal biodiversity for their livelihoods?",
        options: ["1 Billion", "2 Billion", "3 Billion", "5 Billion"],
        correct: 2 // Index of "3 Billion"
    },
    {
        question: "What is the primary cause of ocean acidification?",
        options: ["Plastic pollution", "Oil spills", "Increased CO2 absorption", "Overfishing"],
        correct: 2 // Index of "Increased CO2 absorption"
    },
    {
        question: "Approximately how much plastic enters the ocean each year?",
        options: ["1 million tons", "8 million tons", "20 million tons", "50 million tons"],
        correct: 1 // Index of "8 million tons"
    }
];

let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackText = document.getElementById("quiz-feedback");
const nextBtn = document.getElementById("next-btn");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("quiz-results");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {
    // Reset state
    feedbackText.textContent = "";
    nextBtn.classList.add("hidden");
    optionsContainer.innerHTML = "";

    const q = quizData[currentQuestion];
    questionText.textContent = `Q${currentQuestion + 1}: ${q.question}`;

    q.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.classList.add("option-btn");
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    // Disable all buttons after selection
    const allBtns = optionsContainer.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.style.pointerEvents = "none");

    const correctIndex = quizData[currentQuestion].correct;

    if (selectedIndex === correctIndex) {
        btnElement.classList.add("correct");
        feedbackText.textContent = "Correct! Well done.";
        feedbackText.style.color = "#2ecc71";
        score++;
    } else {
        btnElement.classList.add("wrong");
        allBtns[correctIndex].classList.add("correct"); // Show correct answer
        feedbackText.textContent = "Incorrect. The highlighted answer is correct.";
        feedbackText.style.color = "#e74c3c";
    }

    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    scoreText.textContent = `You scored ${score} out of ${quizData.length}!`;
}

restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    resultsContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    loadQuestion();
});

// Initialize the quiz on load
loadQuestion();
