// --- 0. TOP NAVBAR SCROLL EFFECT ---
const topNav = document.getElementById("topNav");
const navLinks = document.querySelectorAll(".nav-link");
const allSections = document.querySelectorAll("section");

window.addEventListener("scroll", function() {
    // Add background on scroll
    if (window.scrollY > 50) {
        if (topNav) topNav.classList.add("scrolled");
    } else {
        if (topNav) topNav.classList.remove("scrolled");
    }

    // Highlight active link
    let current = "";
    allSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// --- 1. SMOOTH SCROLLING ---
// When the "Learn More" button is clicked, scroll smoothly to the About section.
const learnMoreBtn = document.getElementById("learnMoreBtn");
if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", function() {
        const aboutSection = document.getElementById("about");
        aboutSection.scrollIntoView({ behavior: "smooth" });
    });
}

// Back to Top functionality
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- 2. SCROLL PROGRESS BAR ---
// Update the width of the progress bar based on how much the user has scrolled.
window.addEventListener("scroll", function() {
    const scrollBar = document.getElementById("progressBar");
    if (scrollBar) {
        // Calculate total scrollable height
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Calculate how far down we have scrolled
        const currentScrollPosition = window.scrollY;
        // Calculate percentage
        const scrollPercentage = (currentScrollPosition / totalScrollHeight) * 100;
        // Apply width
        scrollBar.style.width = scrollPercentage + "%";
    }
});

// --- 3. FADE-IN ANIMATION ON SCROLL ---
// Make sections appear smoothly as they enter the screen
const sections = document.querySelectorAll(".section-glass, .hero, .modern-footer");

function checkVisibility() {
    const triggerBottom = window.innerHeight * 0.85;

    // Loop through all sections
    sections.forEach(function(section) {
        const sectionTop = section.getBoundingClientRect().top;

        // If section is in view, add the 'visible' class
        if (sectionTop < triggerBottom) {
            section.classList.add("visible");
        }
    });
}

// Check initially on load, and then on scroll
window.addEventListener("load", checkVisibility);
window.addEventListener("scroll", checkVisibility);

// --- 4. EXPANDABLE CARDS (Causes Section) ---
const expandCards = document.querySelectorAll(".expand-card");

// Loop through each card
expandCards.forEach(function(card) {
    // Find the title element inside the card
    const title = card.querySelector(".expand-title");

    // Add click event to toggle the 'active' class
    if (title) {
        title.addEventListener("click", function() {
            // First, close any other open cards (accordion effect)
            expandCards.forEach(function(otherCard) {
                if (otherCard !== card) {
                    otherCard.classList.remove("active");
                }
            });

            // Toggle the clicked card
            card.classList.toggle("active");
        });
    }
});

// --- 5. FLOATING INFO CARD ---
const closeInfoBtn = document.getElementById("closeInfo");
const floatingInfo = document.getElementById("floatingInfo");

if (closeInfoBtn && floatingInfo) {
    closeInfoBtn.addEventListener("click", function() {
        floatingInfo.classList.add("hidden");
    });
}


// --- 6. DYNAMICALLY GENERATE CARDS (Solutions Section) ---
// Using arrays and map()
const solutionsData = [
    {
        title: "Agroecology",
        icon: "🌱",
        description: "Applying ecological principles to agricultural systems to ensure sustainable farming practices."
    },
    {
        title: "Food Rescue Networks",
        icon: "🍲",
        description: "Redirecting perfectly good, unsold food from markets and restaurants to food banks."
    },
    {
        title: "Climate-Smart Tech",
        icon: "💡",
        description: "Using precision agriculture, drones, and AI to optimize water usage and maximize crop yields."
    },
    {
        title: "Empowering Small Farmers",
        icon: "👩🏽‍🌾",
        description: "Providing local farmers with fair wages, modern tools, and direct access to markets."
    }
];

const solutionsContainer = document.getElementById("solutionsContainer");

if (solutionsContainer) {
    // Use map() to create HTML for each solution, then join() to make it a single string
    const solutionsHTML = solutionsData.map(function(solution) {
        return `
            <div class="solution-card-wrapper">
                <div class="glass-card">
                    <div class="solution-icon">${solution.icon}</div>
                    <div>
                        <h3>${solution.title}</h3>
                        <p>${solution.description}</p>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Insert into the DOM
    solutionsContainer.innerHTML = solutionsHTML;
}


// --- 7. SIMPLE INTERACTIVE QUIZ ---
// Using arrays, objects, and functions
const quizData = [
    {
        question: "What percentage of global food is wasted annually?",
        options: ["10%", "33%", "50%", "5%"],
        answer: "33%"
    },
    {
        question: "Which of these is the primary driver of global hunger?",
        options: ["Poverty", "Lack of space", "Eating too much", "Not enough water"],
        answer: "Poverty"
    },
    {
        question: "By what year does the UN aim to achieve Zero Hunger?",
        options: ["2025", "2030", "2040", "2050"],
        answer: "2030"
    }
];

let currentQuestionIndex = 0;

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedbackText = document.getElementById("feedbackText");

function loadQuestion() {
    if (!optionsContainer) return;
    
    // Clear previous options and feedback
    optionsContainer.innerHTML = "";
    feedbackText.innerText = "";
    
    // Get current question object
    const currentQuiz = quizData[currentQuestionIndex];
    questionText.innerText = currentQuiz.question;

    // Create buttons for options
    currentQuiz.options.forEach(function(option) {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        
        // Add click listener to check answer
        button.addEventListener("click", function() {
            checkAnswer(button, option, currentQuiz.answer);
        });

        optionsContainer.appendChild(button);
    });
}

function checkAnswer(clickedButton, selectedOption, correctAnswer) {
    // Prevent multiple clicks
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        clickedButton.classList.add("correct");
        feedbackText.innerText = "Correct! Great job.";
        feedbackText.style.color = "#27ae60"; // Green
    } else {
        clickedButton.classList.add("wrong");
        feedbackText.innerText = "Incorrect! The right answer is: " + correctAnswer;
        feedbackText.style.color = "#e74c3c"; // Red
        
        // Highlight correct answer
        allButtons.forEach(btn => {
            if(btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    // Move to next question after 2 seconds
    setTimeout(function() {
        currentQuestionIndex++;
        // If there are more questions, load them. Else show completion.
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            questionText.innerText = "Quiz Completed! Thank you for learning about SDG 2.";
            optionsContainer.innerHTML = "";
            feedbackText.innerText = "";
            
            // Restart button
            const restartBtn = document.createElement("button");
            restartBtn.innerText = "Restart Quiz";
            restartBtn.classList.add("cta-btn");
            restartBtn.style.marginTop = "20px";
            restartBtn.addEventListener("click", function() {
                currentQuestionIndex = 0;
                loadQuestion();
            });
            optionsContainer.appendChild(restartBtn);
        }
    }, 2000);
}

// Load the first question when the page loads
if (questionText && optionsContainer) {
    loadQuestion();
}


