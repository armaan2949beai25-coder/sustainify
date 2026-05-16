// script.js - Vanilla JavaScript Interactivity for SDG 4 Website

// 1. Top Animated Scroll Progress Bar
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
    // Calculate how far the user has scrolled down the page
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Set width of the progress bar based on scroll percentage
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollBar.style.width = scrollPercentage + '%';
});


// 2. Active Navbar Links Highlighting based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-center a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Check if user has scrolled past the top 1/3rd of the section
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    // Update active class on links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});


// 3. Counter Animation for Education Impact Stats
const counters = document.querySelectorAll('.counter');
let hasAnimated = false; // Ensure it only animates once

window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const sectionPos = statsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;

    // Trigger animation when the section becomes visible in the viewport
    if (sectionPos < screenPos && !hasAnimated) {
        hasAnimated = true;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // Total duration in ms
            const increment = target / (duration / 16); // 16ms is roughly 1 frame at 60FPS
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter); // Loop animation
                } else {
                    counter.innerText = target; // Ensure exact final value
                }
            };
            updateCounter();
        });
    }
});


// 4. Interactive Quiz System (DOM Manipulation)
const quizData = [
    {
        question: "What is the core aim of Sustainable Development Goal 4?",
        options: ["Improving hospital infrastructure", "Ensuring inclusive and quality education for all", "Providing clean drinking water", "Reducing traffic congestion"],
        correct: 1
    },
    {
        question: "Which of these is a vital target of SDG 4?",
        options: ["Eliminating gender disparities in education", "Building more smart cities", "Reducing the global carbon footprint", "Ocean conservation"],
        correct: 0
    },
    {
        question: "Why is 'Lifelong Learning' emphasized in SDG 4?",
        options: ["To mandate university degrees", "Because learning only happens in schools", "To help people adapt to new skills throughout life", "To increase textbook sales"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const tracker = document.getElementById('question-tracker');
const quizArea = document.getElementById('quiz-area');
const resultArea = document.getElementById('result-area');
const resultMessage = document.getElementById('result-message');
const resultScore = document.getElementById('result-score');
const restartBtn = document.getElementById('restart-btn');

// Function to load a question into the UI
function loadQuestion() {
    selectedOption = null; // Reset selection
    nextBtn.disabled = true; // Disable next button initially
    
    const currentQData = quizData[currentQuestion];
    questionText.innerText = currentQData.question;
    tracker.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Generate new option buttons
    currentQData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt;
        btn.addEventListener('click', () => selectOption(btn, index));
        optionsContainer.appendChild(btn);
    });
}

// Handle option selection
function selectOption(btn, index) {
    // Remove 'selected' class from all buttons
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    
    // Add 'selected' class to clicked button
    btn.classList.add('selected');
    selectedOption = index;
    nextBtn.disabled = false; // Enable next button
}

// Next button event listener
nextBtn.addEventListener('click', () => {
    // Check if correct
    const correctIdx = quizData[currentQuestion].correct;
    if (selectedOption === correctIdx) {
        score++;
    }
    
    currentQuestion++; // Move to next question
    
    if (currentQuestion < quizData.length) {
        loadQuestion(); // Load next question
    } else {
        showResults(); // End of quiz
    }
});

// Function to display final results
function showResults() {
    quizArea.classList.add('hidden'); // Hide questions
    resultArea.classList.remove('hidden'); // Show results
    
    resultScore.innerText = `You scored ${score} out of ${quizData.length}`;
    
    // Custom encouraging messages based on score
    if (score === quizData.length) {
        resultMessage.innerText = "Excellent! You are an SDG 4 Champion! 🎓";
    } else if (score > 0) {
        resultMessage.innerText = "Good job! Keep exploring Quality Education topics. 📚";
    } else {
        resultMessage.innerText = "Keep learning! Knowledge is a lifelong journey. 💡";
    }
}

// Restart quiz functionality
restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    resultArea.classList.add('hidden');
    quizArea.classList.remove('hidden');
    loadQuestion();
});

// Initialize the first question when the script loads
if (quizArea) {
    loadQuestion();
}


// 5. Back to Top Button Functionality
const backToTopBtn = document.getElementById('back-to-top');
if(backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
