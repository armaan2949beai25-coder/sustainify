// ---- 1. Progress Tracker ----
// Event listener for scroll to update the progress bar width
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('myBar').style.width = scrolled + '%';
});

// ---- 2. Header Background & Active Link Highlighting ----
const header = document.getElementById('header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    // Header styling on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Adjusted slightly for header offset
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ---- 3. Interactive Quiz Application ----
// Quiz Data using Array of Objects
const quizData = [
    {
        question: "What percentage of food produced globally is lost or wasted?",
        options: ["10%", "33%", "50%", "75%"],
        correctAnswer: 1, // index of "33%"
        explanation: "About one-third (33%) or 1.3 billion tons of all food produced globally is lost or wasted every year."
    },
    {
        question: "Which of the following is a principle of the Circular Economy?",
        options: ["Take, Make, Dispose", "Design out waste and pollution", "Increase single-use plastics", "Planned obsolescence"],
        correctAnswer: 1,
        explanation: "The circular economy aims to design out waste and pollution, keep products and materials in use, and regenerate natural systems."
    },
    {
        question: "How can individuals best contribute to SDG 12?",
        options: ["Buying more fast fashion", "Leaving electronics plugged in", "Reducing, Reusing, and Recycling", "Using more single-use packaging"],
        correctAnswer: 2,
        explanation: "Reducing consumption, reusing items, and recycling materials are fundamental individual actions for SDG 12."
    }
];

// Quiz State
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const scoreContainer = document.getElementById('score-container');
const scoreSpan = document.getElementById('score');
const totalSpan = document.getElementById('total-questions');
const restartBtn = document.getElementById('restart-btn');

// Initialize Quiz
const initQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreContainer.classList.add('hidden');
    questionText.classList.remove('hidden');
    optionsContainer.classList.remove('hidden');
    totalSpan.textContent = quizData.length;
    loadQuestion();
};

// Load Question Data
const loadQuestion = () => {
    // Reset state
    feedbackText.textContent = '';
    feedbackText.style.color = 'var(--text-main)';
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = ''; // Clear previous options

    const currentQuizData = quizData[currentQuestionIndex];
    questionText.textContent = `${currentQuestionIndex + 1}. ${currentQuizData.question}`;

    // Create Option Buttons using Higher-Order Function (forEach)
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        // Event listener for checking answer
        button.addEventListener('click', () => checkAnswer(index, button));
        optionsContainer.appendChild(button);
    });
};

// Check Selected Answer
const checkAnswer = (selectedIndex, selectedButton) => {
    // Disable all buttons once an answer is selected
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    const correctIndex = quizData[currentQuestionIndex].correctAnswer;

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        score++;
        feedbackText.textContent = `Correct! ${quizData[currentQuestionIndex].explanation}`;
        feedbackText.style.color = '#2ebf6a';
    } else {
        selectedButton.classList.add('wrong');
        // Highlight correct answer
        allButtons[correctIndex].classList.add('correct');
        feedbackText.textContent = `Incorrect. ${quizData[currentQuestionIndex].explanation}`;
        feedbackText.style.color = '#bf2e2e';
    }

    nextBtn.classList.remove('hidden');
};

// Handle Next Question
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Show Final Results
const showResults = () => {
    questionText.classList.add('hidden');
    optionsContainer.classList.add('hidden');
    feedbackText.textContent = '';
    nextBtn.classList.add('hidden');
    
    scoreSpan.textContent = score;
    scoreContainer.classList.remove('hidden');
};

// Restart Quiz
restartBtn.addEventListener('click', initQuiz);

// Start the quiz when script loads
document.addEventListener('DOMContentLoaded', initQuiz);
