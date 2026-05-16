// ==========================================
// SDG 5 - Gender Equality Interactive Logic
// ==========================================

// 1. Top Scroll Progress Bar
const scrollBar = document.getElementById('scrollBar');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollBar.style.width = scrollPercentage + '%';
});

// 2. Animated Counters (Impact Stats)
const counters = document.querySelectorAll('.counter');
const speed = 50; // lower is faster

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 40);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer to trigger counter animation when in view
const statsSection = document.querySelector('.impact-section');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect(); // only animate once
    }
}, { threshold: 0.5 });

if (statsSection) {
    observer.observe(statsSection);
}

// 3. Equality Awareness Quiz
const quizData = [
    {
        question: "What is a primary goal of SDG 5?",
        options: [
            "Provide free internet access",
            "Achieve gender equality and empower all women and girls",
            "Build new schools in rural areas",
            "Reduce carbon emissions"
        ],
        correct: 1
    },
    {
        question: "How can individuals support workplace equality?",
        options: [
            "By ignoring the gender pay gap",
            "By advocating for equal pay and leadership opportunities",
            "By separating teams based on gender",
            "By discouraging women from negotiating salary"
        ],
        correct: 1
    },
    {
        question: "Which of the following is crucial for ending gender discrimination?",
        options: [
            "Challenging gender stereotypes and biases",
            "Limiting educational opportunities",
            "Relying solely on government actions",
            "Maintaining traditional gender roles"
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const resultEl = document.getElementById('quiz-result');
const resultMessage = document.getElementById('result-message');
const retryBtn = document.getElementById('retry-btn');

function loadQuestion() {
    // Reset state
    optionsContainer.innerHTML = '';
    resultEl.classList.add('hidden');
    
    const currentQuizData = quizData[currentQuestion];
    questionEl.innerText = `${currentQuestion + 1}. ${currentQuizData.question}`;

    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('btn-glass', 'option-btn');
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex, selectedButton) {
    const correctIndex = quizData[currentQuestion].correct;
    
    // Disable all buttons
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.style.pointerEvents = 'none');

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        allButtons[correctIndex].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1500); // Wait 1.5s before next question
}

function showResult() {
    questionEl.innerText = "Quiz Completed!";
    optionsContainer.innerHTML = '';
    resultEl.classList.remove('hidden');
    retryBtn.classList.remove('hidden');

    if (score === quizData.length) {
        resultMessage.innerText = `Amazing! You scored ${score}/${quizData.length}. You are an excellent advocate for gender equality.`;
    } else {
        resultMessage.innerText = `You scored ${score}/${quizData.length}. Keep learning and advocating for equal rights!`;
    }
}

retryBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    retryBtn.classList.add('hidden');
    loadQuestion();
});

// Initialize Quiz
if (questionEl) {
    loadQuestion();
}
