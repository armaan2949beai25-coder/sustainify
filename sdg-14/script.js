// --- Progress Tracker ---
window.onscroll = function() { 
    updateProgress();
    revealTimeline();
    
    // Check if counters are in view
    const counterSection = document.getElementById('facts-counter');
    if (counterSection) {
        const top = counterSection.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            startCounters();
        }
    }
};

// --- Counters Animation ---
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
}

// --- Timeline Scroll Reveal ---
function revealTimeline() {
    const reveals = document.querySelectorAll('.timeline-item');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('visible');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    revealTimeline();
});

// --- Comparison Slider ---
const slider = document.getElementById('compare-slider');
const beforeImage = document.getElementById('before-image');
const sliderButton = document.getElementById('slider-button');

if (slider) {
    slider.addEventListener('input', (e) => {
        const value = e.target.value;
        beforeImage.style.width = `${value}%`;
        sliderButton.style.left = `${value}%`;
    });
}

// --- Quote Carousel ---
let slideIndex = 0;
let slideInterval;

function showSlides(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;
    
    if (n !== undefined) {
        slideIndex = n;
        clearInterval(slideInterval);
        startAutoSlide();
    } else {
        slideIndex++;
    }
    
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if(slides[slideIndex]) slides[slideIndex].classList.add('active');
    if(dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function currentSlide(n) {
    showSlides(n);
}

function startAutoSlide() {
    slideInterval = setInterval(() => showSlides(), 5000);
}

if (document.querySelectorAll('.carousel-slide').length > 0) {
    startAutoSlide();
}

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

// --- New Marine Quiz ---
const newQuizData = [
    {
        question: "Which marine creature is known as the 'rainforests of the sea'?",
        options: ["Kelp Forests", "Coral Reefs", "Mangroves", "Sea Grass"],
        correct: 1
    },
    {
        question: "How much of the world's oxygen is produced by the ocean?",
        options: ["20%", "30%", "50%", "80%"],
        correct: 2
    },
    {
        question: "Which of these is NOT a significant threat to marine life?",
        options: ["Overfishing", "Ocean Acidification", "Desalination", "Plastic Pollution"],
        correct: 2
    },
    {
        question: "What is the largest animal to have ever lived on Earth?",
        options: ["Megalodon", "Blue Whale", "Giant Squid", "Whale Shark"],
        correct: 1
    }
];

let newCurrentQuestion = 0;
let newScore = 0;

const newQuestionText = document.getElementById("new-question-text");
const newOptionsContainer = document.getElementById("new-options-container");
const newFeedbackText = document.getElementById("new-quiz-feedback");
const newNextBtn = document.getElementById("new-next-btn");
const newQuizContainer = document.getElementById("new-quiz-container");
const newResultsContainer = document.getElementById("new-quiz-results");
const newScoreText = document.getElementById("new-score-text");
const newRestartBtn = document.getElementById("new-restart-btn");

function newLoadQuestion() {
    if (!newQuestionText) return;
    
    newFeedbackText.textContent = "";
    newNextBtn.classList.add("hidden");
    newOptionsContainer.innerHTML = "";

    const q = newQuizData[newCurrentQuestion];
    newQuestionText.textContent = `Q${newCurrentQuestion + 1}: ${q.question}`;

    q.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.classList.add("option-btn");
        btn.onclick = () => newCheckAnswer(index, btn);
        newOptionsContainer.appendChild(btn);
    });
}

function newCheckAnswer(selectedIndex, btnElement) {
    const allBtns = newOptionsContainer.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.style.pointerEvents = "none");

    const correctIndex = newQuizData[newCurrentQuestion].correct;

    if (selectedIndex === correctIndex) {
        btnElement.classList.add("correct");
        newFeedbackText.textContent = "Awesome! That's correct.";
        newFeedbackText.style.color = "#2ecc71";
        newScore++;
    } else {
        btnElement.classList.add("wrong");
        allBtns[correctIndex].classList.add("correct");
        newFeedbackText.textContent = "Oops! The highlighted answer is correct.";
        newFeedbackText.style.color = "#e74c3c";
    }

    newNextBtn.classList.remove("hidden");
}

if (newNextBtn) {
    newNextBtn.addEventListener("click", () => {
        newCurrentQuestion++;
        if (newCurrentQuestion < newQuizData.length) {
            newLoadQuestion();
        } else {
            newShowResults();
        }
    });
}

function newShowResults() {
    newQuizContainer.classList.add("hidden");
    newResultsContainer.classList.remove("hidden");
    newScoreText.textContent = `You scored ${newScore} out of ${newQuizData.length}!`;
}

if (newRestartBtn) {
    newRestartBtn.addEventListener("click", () => {
        newCurrentQuestion = 0;
        newScore = 0;
        newResultsContainer.classList.add("hidden");
        newQuizContainer.classList.remove("hidden");
        newLoadQuestion();
    });
}

// Initialize the new quiz on load
newLoadQuestion();
