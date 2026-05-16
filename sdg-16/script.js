// --- Progress Tracker ---
// Update the width of the progress bar in the header as the user scrolls
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
});

// --- Assessment Tool ---
const questions = [
    {
        question: "Which of these is a core target of SDG 16?",
        options: [
            "Achieving universal healthcare", 
            "Substantially reducing corruption and bribery", 
            "Providing free higher education", 
            "Eliminating fossil fuels"
        ],
        answer: 1
    },
    {
        question: "What does the 'Rule of Law' guarantee?",
        options: [
            "Complete immunity for government officials", 
            "Laws that change rapidly based on trends", 
            "Equal access to justice and legal protection for all", 
            "Justice systems controlled by private entities"
        ],
        answer: 2
    },
    {
        question: "What is considered essential for achieving sustainable development?",
        options: [
            "High levels of corruption", 
            "Exclusive decision-making bodies", 
            "Peaceful, just, and inclusive societies", 
            "Restricted access to information"
        ],
        answer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements for Assessment
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const feedbackText = document.getElementById('quiz-feedback');
const quizContainer = document.getElementById('quiz-container');
const quizResults = document.getElementById('quiz-results');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

function loadQuestion() {
    // Reset state for new question
    nextBtn.classList.add('hidden');
    feedbackText.textContent = '';
    optionsContainer.innerHTML = ''; // Clear previous options
    
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;

    // Create buttons for each option
    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        // Attach click event listener
        button.addEventListener('click', () => checkAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    const currentQ = questions[currentQuestionIndex];
    const allOptions = optionsContainer.children;

    // Disable all options after user makes a choice
    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].disabled = true;
        allOptions[i].style.cursor = 'not-allowed';
    }

    if (selectedIndex === currentQ.answer) {
        selectedButton.classList.add('correct');
        feedbackText.textContent = 'Excellent! That is correct.';
        feedbackText.style.color = '#10b981'; // Green
        score++;
    } else {
        selectedButton.classList.add('wrong');
        // Highlight the correct answer
        allOptions[currentQ.answer].classList.add('correct');
        feedbackText.textContent = 'Incorrect. The highlighted option is the correct answer.';
        feedbackText.style.color = '#ef4444'; // Red
    }

    // Show the next button
    nextBtn.classList.remove('hidden');
}

// Next button event listener
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizContainer.classList.add('hidden');
    quizResults.classList.remove('hidden');
    scoreDisplay.textContent = score;
}

// Restart button event listener
restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.classList.remove('hidden');
    quizResults.classList.add('hidden');
    loadQuestion();
});

// Initialize the first question on load
loadQuestion();

// --- Pledge Form Handling ---
const pledgeForm = document.getElementById('pledge-form');
const formFeedback = document.getElementById('form-feedback');
const pledgeNameResponse = document.getElementById('pledge-name-response');

pledgeForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Get user input
    const name = document.getElementById('name').value;
    
    // Hide form and show feedback message
    pledgeForm.classList.add('hidden');
    formFeedback.classList.remove('hidden');
    
    // Personalize the message
    pledgeNameResponse.textContent = `Your pledge to support SDG 16 has been securely recorded, ${name}.`;
});
