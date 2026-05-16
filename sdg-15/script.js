// Progress Bar Logic
window.onscroll = function() { updateProgressBar() };

function updateProgressBar() {
    // Get how much the user has scrolled
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Get the total scrollable height
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Calculate the percentage
    let scrolled = (winScroll / height) * 100;
    
    // Update the width of the progress bar
    document.getElementById("myBar").style.width = scrolled + "%";
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('nav a, .btn[href^="#"]');

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function(e) {
        e.preventDefault();
        
        let targetId = this.getAttribute('href');
        let targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // adjust for header height
                behavior: 'smooth'
            });
        }
    });
}

// Quiz Logic
const questions = [
    {
        question: "What percentage of the earth's surface has been altered by human activity?",
        options: ["25%", "50%", "75%", "90%"],
        answerIndex: 2,
        explanation: "75% of the earth's surface has been altered by humans."
    },
    {
        question: "How many animal and plant species are threatened with extinction?",
        options: ["100,000", "500,000", "1 million", "2 million"],
        answerIndex: 2,
        explanation: "Around 1 million species are currently threatened with extinction."
    },
    {
        question: "Which of the following is a leading cause of deforestation?",
        options: ["Animal agriculture", "Urban parks", "Solar farms", "Eco-tourism"],
        answerIndex: 0,
        explanation: "Animal agriculture, including cattle ranching and soy production for feed, is a major driver of deforestation."
    },
    {
        question: "What does FSC stand for in sustainable products?",
        options: ["Forest Security Council", "Forest Stewardship Council", "Farming Sustainability Coalition", "Future Society of Conservation"],
        answerIndex: 1,
        explanation: "FSC stands for Forest Stewardship Council, which certifies sustainably sourced products."
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackText = document.getElementById('quiz-feedback');
const nextBtn = document.getElementById('next-btn');

function loadQuestion() {
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    optionsContainer.innerHTML = '';
    feedbackText.classList.add('hidden');
    nextBtn.classList.add('hidden');

    for (let i = 0; i < currentQ.options.length; i++) {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = currentQ.options[i];
        btn.addEventListener('click', function() {
            checkAnswer(i, btn);
        });
        optionsContainer.appendChild(btn);
    }
}

function checkAnswer(selectedIndex, clickedBtn) {
    const currentQ = questions[currentQuestionIndex];
    const optionBtns = document.querySelectorAll('.option-btn');
    
    // Disable all options
    for (let i = 0; i < optionBtns.length; i++) {
        optionBtns[i].disabled = true;
        optionBtns[i].style.cursor = 'not-allowed';
        if (i === currentQ.answerIndex) {
            optionBtns[i].classList.add('correct');
        }
    }
    
    if (selectedIndex === currentQ.answerIndex) {
        score++;
        feedbackText.textContent = "Correct! " + currentQ.explanation;
        feedbackText.style.color = "var(--sdg15-color)";
    } else {
        clickedBtn.classList.add('wrong');
        feedbackText.textContent = "Incorrect. " + currentQ.explanation;
        feedbackText.style.color = "#ef4444";
    }
    
    feedbackText.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', function() {
    if (currentQuestionIndex >= questions.length - 1) {
        if (nextBtn.textContent === "Restart Quiz") {
            currentQuestionIndex = 0;
            score = 0;
            nextBtn.textContent = "Next Question";
            loadQuestion();
        } else {
            // Show results
            questionText.textContent = "Quiz Completed! You scored " + score + " out of " + questions.length + ".";
            optionsContainer.innerHTML = '';
            feedbackText.classList.add('hidden');
            nextBtn.textContent = "Restart Quiz";
        }
    } else {
        currentQuestionIndex++;
        loadQuestion();
    }
});

// Initialize the first question
loadQuestion();

// Accordion Logic
const accordions = document.querySelectorAll('.accordion-header');

accordions.forEach(acc => {
    acc.addEventListener('click', function() {
        const card = this.parentElement;
        
        // Close other cards
        const allCards = document.querySelectorAll('.accordion-card');
        allCards.forEach(c => {
            if (c !== card && c.classList.contains('active')) {
                c.classList.remove('active');
            }
        });

        // Toggle current card
        card.classList.toggle('active');
    });
});
