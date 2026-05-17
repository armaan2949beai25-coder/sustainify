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

// --- NEW SECTIONS LOGIC ---

// 1. Intersection Observer for Animations (Stats, Timeline, Progress Bars)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Stats Counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
            // Timeline Items
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
            // Progress Bars
            if (entry.target.classList.contains('progress-fill')) {
                entry.target.style.width = entry.target.getAttribute('data-width');
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.stat-number, .timeline-item, .progress-fill').forEach(el => {
    observer.observe(el);
});

function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target)) || 10;
    let current = 0;
    
    const timer = setInterval(() => {
        current += Math.ceil(target / (duration / stepTime));
        if (current >= target) {
            el.innerText = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.innerText = current.toLocaleString();
        }
    }, stepTime);
}

// 2. Before vs After Comparison Slider
const slider = document.getElementById('comparison-slider');
const beforeImage = document.getElementById('image-before');
const sliderHandle = document.getElementById('slider-handle');

if (slider) {
    let isDragging = false;

    slider.addEventListener('mousedown', (e) => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    
    slider.addEventListener('touchstart', (e) => { isDragging = true; }, {passive: true});
    window.addEventListener('touchend', () => { isDragging = false; });

    const slide = (x) => {
        const sliderRect = slider.getBoundingClientRect();
        let position = ((x - sliderRect.left) / sliderRect.width) * 100;
        
        // Boundaries
        if (position < 0) position = 0;
        if (position > 100) position = 100;
        
        beforeImage.style.width = position + '%';
        sliderHandle.style.left = position + '%';
    };

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        slide(e.pageX);
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        slide(e.touches[0].pageX);
    }, {passive: true});
}

// 3. Biodiversity Quiz Logic
const bioQuestions = [
    {
        question: "Which ecosystem captures the most carbon per acre?",
        options: ["Tropical Forests", "Peatlands", "Grasslands", "Deserts"],
        answerIndex: 1,
        explanation: "Peatlands are the most efficient carbon sink on the planet, storing more carbon than all other vegetation types in the world combined."
    },
    {
        question: "What percentage of the world's documented species can be found in forests?",
        options: ["20%", "40%", "60%", "80%"],
        answerIndex: 3,
        explanation: "Forests are home to more than 80% of all terrestrial species of animals, plants and insects."
    },
    {
        question: "Which of the following is NOT a major cause of desertification?",
        options: ["Overgrazing", "Deforestation", "Crop rotation", "Climate Change"],
        answerIndex: 2,
        explanation: "Crop rotation is a sustainable farming practice, while the others are major drivers of desertification."
    },
    {
        question: "What is a 'keystone species'?",
        options: ["A species that builds nests in stones", "A species on which other species largely depend", "The oldest species in a forest", "A species that has gone extinct"],
        answerIndex: 1,
        explanation: "A keystone species holds an ecosystem together. If removed, the ecosystem would change drastically or collapse."
    }
];

let bioCurrentQuestionIndex = 0;
let bioScore = 0;

const bioQuestionText = document.getElementById('bio-question-text');
const bioOptionsContainer = document.getElementById('bio-options-container');
const bioFeedbackText = document.getElementById('bio-quiz-feedback');
const bioNextBtn = document.getElementById('bio-next-btn');

function loadBioQuestion() {
    if (!bioQuestionText) return;
    const currentQ = bioQuestions[bioCurrentQuestionIndex];
    bioQuestionText.textContent = currentQ.question;
    bioOptionsContainer.innerHTML = '';
    bioFeedbackText.classList.add('hidden');
    bioNextBtn.classList.add('hidden');

    for (let i = 0; i < currentQ.options.length; i++) {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = currentQ.options[i];
        btn.addEventListener('click', function() {
            checkBioAnswer(i, btn);
        });
        bioOptionsContainer.appendChild(btn);
    }
}

function checkBioAnswer(selectedIndex, clickedBtn) {
    const currentQ = bioQuestions[bioCurrentQuestionIndex];
    const optionBtns = bioOptionsContainer.querySelectorAll('.option-btn');
    
    // Disable all options
    for (let i = 0; i < optionBtns.length; i++) {
        optionBtns[i].disabled = true;
        optionBtns[i].style.cursor = 'not-allowed';
        if (i === currentQ.answerIndex) {
            optionBtns[i].classList.add('correct');
        }
    }
    
    if (selectedIndex === currentQ.answerIndex) {
        bioScore++;
        bioFeedbackText.textContent = "Correct! " + currentQ.explanation;
        bioFeedbackText.style.color = "var(--primary)";
    } else {
        clickedBtn.classList.add('wrong');
        bioFeedbackText.textContent = "Incorrect. " + currentQ.explanation;
        bioFeedbackText.style.color = "#ef4444";
    }
    
    bioFeedbackText.classList.remove('hidden');
    bioNextBtn.classList.remove('hidden');
}

if (bioNextBtn) {
    bioNextBtn.addEventListener('click', function() {
        if (bioCurrentQuestionIndex >= bioQuestions.length - 1) {
            if (bioNextBtn.textContent === "Restart Quiz") {
                bioCurrentQuestionIndex = 0;
                bioScore = 0;
                bioNextBtn.textContent = "Next Question";
                loadBioQuestion();
            } else {
                bioQuestionText.textContent = "Quiz Completed! You scored " + bioScore + " out of " + bioQuestions.length + ".";
                bioOptionsContainer.innerHTML = '';
                bioFeedbackText.classList.add('hidden');
                bioNextBtn.textContent = "Restart Quiz";
            }
        } else {
            bioCurrentQuestionIndex++;
            loadBioQuestion();
        }
    });
    
    loadBioQuestion();
}

// 4. Nature Quotes Carousel Logic
const carouselTrack = document.getElementById('carousel-track');
const indicatorsContainer = document.getElementById('carousel-indicators');

if (carouselTrack) {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    
    // Create indicators
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        indicatorsContainer.appendChild(dot);
    });

    const indicators = document.querySelectorAll('.indicator');

    function goToSlide(idx) {
        currentSlide = idx;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        indicators.forEach(ind => ind.classList.remove('active'));
        if(indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    // Auto slide
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        goToSlide(nextSlide);
    }, 5000);
}

// 5. Ecosystem Tabs Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.ecosystem-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');
        const targetId = `tab-${btn.getAttribute('data-tab')}`;
        document.getElementById(targetId).classList.add('active');
    });
});

