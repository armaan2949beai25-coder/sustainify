// --- TOP SCROLL PROGRESS BAR ---
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = document.documentElement.scrollTop;
    const progress = (scrollPosition / scrollTotal) * 100;
    progressBar.style.width = progress + '%';
});

// --- NAVBAR ACTIVE LINK HIGHLIGHTING ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-center a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
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

// --- ANIMATED COUNTERS ---
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;

        const updateCount = () => {
            const current = +counter.innerText;
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

const statsSection = document.getElementById('stats');
const observerStats = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasCounted) {
        animateCounters();
        hasCounted = true;
    }
}, { threshold: 0.5 });

if (statsSection) observerStats.observe(statsSection);

// --- HEALTH PROGRESS TRACKERS ---
const progressBars = document.querySelectorAll('.progress-bar-fill');
let hasProgressed = false;

const progressSection = document.getElementById('progress');
const observerProgress = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasProgressed) {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
        hasProgressed = true;
    }
}, { threshold: 0.5 });

if (progressSection) observerProgress.observe(progressSection);


// --- INTERACTIVE BMI CALCULATOR ---
const bmiForm = document.getElementById('bmi-form');
const bmiResultDiv = document.getElementById('bmi-result');
const bmiValueDisplay = document.getElementById('bmi-value');
const bmiCategoryDisplay = document.getElementById('bmi-category');

if (bmiForm) {
    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const heightCm = parseFloat(document.getElementById('height').value);
        const weightKg = parseFloat(document.getElementById('weight').value);

        if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
            alert("Please enter valid positive numbers.");
            return;
        }

        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        let category = '';
        let bgColor = '';

        if (bmi < 18.5) {
            category = "Underweight"; bgColor = "#f39c12";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = "Healthy Weight"; bgColor = "#2ecc71";
        } else if (bmi >= 25 && bmi < 29.9) {
            category = "Overweight"; bgColor = "#f39c12";
        } else {
            category = "Obesity"; bgColor = "#e74c3c";
        }

        bmiValueDisplay.innerText = bmi;
        bmiCategoryDisplay.innerText = category;
        bmiCategoryDisplay.style.backgroundColor = bgColor;
        bmiResultDiv.classList.remove('hidden');
    });
}

// --- INTERACTIVE HEALTH QUIZ ---
const quizData = [
    { question: "How much sleep is recommended per night?", options: ["4-5 hours", "7-9 hours", "10-12 hours"], answer: 1 },
    { question: "Which of these is a major SDG 3 target?", options: ["Reduce maternal mortality", "Build space stations", "Increase fast food production"], answer: 0 },
    { question: "How many glasses of water should you drink daily?", options: ["2-3 glasses", "5-6 glasses", "8+ glasses"], answer: 2 },
    { question: "What is an effective way to prevent Malaria?", options: ["Mosquito nets", "Drinking milk", "Wearing sandals"], answer: 0 }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizProgressFill = document.getElementById('quiz-progress');
const quizUI = document.getElementById('quiz-ui');
const quizResult = document.getElementById('quiz-result');
const quizScoreEl = document.getElementById('quiz-score');
const quizMessageEl = document.getElementById('quiz-message');
const restartBtn = document.getElementById('restart-quiz');

function loadQuiz() {
    if (!questionEl) return;
    quizFeedback.classList.add('hidden');
    optionsEl.innerHTML = '';
    
    const q = quizData[currentQuestion];
    questionEl.innerText = q.question;
    
    const progressPercent = ((currentQuestion) / quizData.length) * 100;
    quizProgressFill.style.width = progressPercent + "%";

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.classList.add('quiz-btn');
        btn.addEventListener('click', () => selectAnswer(index, btn));
        optionsEl.appendChild(btn);
    });
}

function selectAnswer(selectedIndex, btn) {
    const correctIndex = quizData[currentQuestion].answer;
    
    const allBtns = optionsEl.querySelectorAll('.quiz-btn');
    allBtns.forEach(b => b.disabled = true); // Disable clicking twice
    
    quizFeedback.classList.remove('hidden');
    
    if (selectedIndex === correctIndex) {
        btn.classList.add('correct');
        quizFeedback.innerText = "Correct! Well done.";
        quizFeedback.style.color = "#2ecc71";
        score++;
    } else {
        btn.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct');
        quizFeedback.innerText = "Incorrect!";
        quizFeedback.style.color = "#e74c3c";
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuiz();
        } else {
            showQuizResult();
        }
    }, 1500);
}

function showQuizResult() {
    quizUI.classList.add('hidden');
    quizResult.classList.remove('hidden');
    quizProgressFill.style.width = "100%";
    
    quizScoreEl.innerText = `You scored ${score} out of ${quizData.length}`;
    if(score === quizData.length) {
        quizMessageEl.innerText = "Perfect! You have excellent health awareness.";
    } else if (score > quizData.length / 2) {
        quizMessageEl.innerText = "Good job! You know your health basics.";
    } else {
        quizMessageEl.innerText = "There is always more to learn about health. Explore the site to know more!";
    }
}

if(restartBtn) {
    restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        quizResult.classList.add('hidden');
        quizUI.classList.remove('hidden');
        loadQuiz();
    });
}

loadQuiz();

// --- HEALTH TIPS CAROUSEL ---
const track = document.getElementById('carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

if (track && slides.length > 0) {
    let currentSlide = 0;
    
    const updateSlidePosition = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (slideWidth * currentSlide) + 'px)';
        slides.forEach(s => s.classList.remove('active-slide'));
        slides[currentSlide].classList.add('active-slide');
    };

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
        updateSlidePosition();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
        updateSlidePosition();
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
        updateSlidePosition();
    }, 5000);

    // Initial positioning on window resize
    window.addEventListener('resize', updateSlidePosition);
}
