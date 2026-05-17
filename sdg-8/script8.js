// ==========================================
// SUSTAINIFY - SDG 8 JAVASCRIPT REFACTORED
// ==========================================

// --- 1. STATE & CONSTANTS ---
const appState = {
    isLoaded: false
};

// --- 2. DOM ELEMENTS ---
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const UI = {
    preloader: select("#preloader"),
    navbar: select("#navbar"),
    navLinks: select("#nav-links"),
    mobileToggle: select("#mobile-toggle"),
    progressBar: select("#scroll-progress"),
    backToTopBtn: select("#back-to-top"),
    skillForm: select("#skill-form"),
    scoreCircle: select("#score-circle"),
    scoreValue: select("#score-value"),
    levelText: select("#productivity-level"),
    suggestionsText: select("#improvement-suggestions"),
    motivationalText: select("#motivational-feedback"),
    communityForm: select("#community-form"),
    modal: select("#success-modal"),
    closeModalBtn: select("#close-modal")
};

// --- 3. INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
    appState.isLoaded = true;
    initApp();
});

const initApp = () => {
    setupScrollInteractions();
    setupMobileMenu();
    setupIntersectionObservers();
    setupSkillBuilder();
    setupFormValidation();
};

// --- 4. SCROLL & BOM INTERACTIONS ---
const setupScrollInteractions = () => {
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress Bar
        UI.progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
        
        // Navbar styling
        UI.navbar.classList.toggle("scrolled", scrollTop > 50);
        
        // Back to top button
        UI.backToTopBtn.classList.toggle("show", scrollTop > 500);

        // Active Nav Link highlighting
        updateActiveNavLink(scrollTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    UI.backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
};

const updateActiveNavLink = (scrollY) => {
    let currentSection = "";
    selectAll("section").forEach(section => {
        if (scrollY >= (section.offsetTop - section.clientHeight / 3)) {
            currentSection = section.id;
        }
    });

    selectAll(".nav-links a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href").includes(currentSection));
    });
};

// --- 5. UI COMPONENTS ---
const setupMobileMenu = () => {
    UI.mobileToggle.addEventListener("click", () => {
        const isActive = UI.navLinks.classList.toggle("active");
        UI.mobileToggle.innerHTML = `<i class="fas ${isActive ? 'fa-times' : 'fa-bars'}"></i>`;
    });

    selectAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            UI.navLinks.classList.remove("active");
            UI.mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
};

// --- 6. INTERSECTION OBSERVERS (DRY Logic) ---
const setupIntersectionObservers = () => {
    const observerOptions = { threshold: 0.2 };

    const animateNumber = (element) => {
        const target = +element.getAttribute("data-target");
        const count = +element.innerText;
        const inc = target / 200;

        if (count < target) {
            element.innerText = Math.ceil(count + inc);
            setTimeout(() => animateNumber(element), 10);
        } else {
            element.innerText = target;
        }
    };

    const globalObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Handle reveals
                if (el.classList.contains("reveal")) {
                    el.classList.add("active");
                }
                
                // Handle counters
                if (el.classList.contains("counter")) {
                    animateNumber(el);
                    obs.unobserve(el);
                }

                // Handle progress bars
                if (el.classList.contains("prog-fill")) {
                    el.style.width = el.getAttribute("data-width");
                    obs.unobserve(el);
                }
            }
        });
    }, observerOptions);

    // Observe all applicable elements
    selectAll(".reveal, .counter, .prog-fill").forEach(el => globalObserver.observe(el));
};

// --- 7. CALCULATORS (Skill Builder) ---
const setupSkillBuilder = () => {
    // Closure for weighted score
    const getScoreMultiplier = (multipliers) => (values) => {
        return values.reduce((total, val, i) => total + (val * multipliers[i]), 0);
    };
    
    const calculateScore = getScoreMultiplier([2, 3, 1, 10]); // learning, coding, reading, projects

    UI.skillForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const inputs = [
            Number(select("#learning-hours").value),
            Number(select("#coding-practice").value),
            Number(select("#reading-hours").value),
            Number(select("#projects-completed").value)
        ];

        const rawScore = calculateScore(inputs);
        const finalScore = Math.min(rawScore, 100);
        
        updateDashboard(finalScore);
    });

    const updateDashboard = (score) => {
        // Animate Circle
        let current = parseInt(UI.scoreValue.innerText) || 0;
        const interval = setInterval(() => {
            if (current === score) clearInterval(interval);
            else current += (current < score ? 1 : -1);
            
            UI.scoreValue.innerText = current;
            UI.scoreCircle.style.background = `conic-gradient(var(--primary) ${current * 3.6}deg, rgba(255,255,255,0.3) 0deg)`;
        }, 15);

        // Feedback Logic
        const setFeedback = (level, suggestion, motivation) => {
            UI.levelText.innerText = `Level: ${level}`;
            UI.suggestionsText.innerText = suggestion;
            UI.motivationalText.innerText = motivation;
        };

        if (score >= 90) setFeedback("Expert Innovator", "Excellent balance of learning and execution.", "You embody SDG 8!");
        else if (score >= 70) setFeedback("Advanced Professional", "Great progress! Try taking on more complex projects.", "Consistency is key.");
        else if (score >= 40) setFeedback("Intermediate Learner", "Focus on increasing coding practice.", "Keep pushing forward.");
        else setFeedback("Beginner Explorer", "Start logging consistent hours.", "Every expert was once a beginner.");
    };
};

// --- 8. ASYNC VALIDATION (Community Form) ---
const setupFormValidation = () => {
    // Event bubbling for styling
    UI.communityForm.addEventListener("input", (e) => {
        if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) {
            e.target.style.borderColor = "var(--primary)";
        }
    });

    const mockApiRequest = async () => new Promise(resolve => setTimeout(() => resolve("Success"), 1500));

    UI.communityForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = select("#name").value.trim();
        const email = select("#email").value.trim();
        const btn = UI.communityForm.querySelector('button[type="submit"]');
        
        // Simple Validation
        let isValid = true;
        if (name.length < 3) { select("#name-error").innerText = "Name is too short."; isValid = false; }
        else select("#name-error").innerText = "";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { select("#email-error").innerText = "Invalid email."; isValid = false; }
        else select("#email-error").innerText = "";

        if (!isValid) return;

        // API Submission
        try {
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            
            await mockApiRequest();
            
            btn.innerText = originalText;
            UI.modal.classList.add("show");
            UI.communityForm.reset();
        } catch (error) {
            console.error("Submission failed", error);
        }
    });

    UI.closeModalBtn.addEventListener("click", () => UI.modal.classList.remove("show"));
};
