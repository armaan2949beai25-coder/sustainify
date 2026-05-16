/**
 * Sustainify SDG 10 - Script
 * Demonstrating advanced JS concepts while powering a premium UI.
 */

// 1. DATA - Voices Section (Arrays & Objects)
const voicesData = [
    {
        id: 1,
        title: "The Silent Strength",
        category: "youth",
        author: "Amina J.",
        content: "Empowering youth in remote villages to access digital education platforms.",
        impact: "5,000+ Students connected",
        date: "2026-02-15"
    },
    {
        id: 2,
        title: "Inclusion at Work",
        category: "work",
        author: "Mark T.",
        content: "Redefining workplace culture to accommodate neurodiversity and equal pay.",
        impact: "20+ Corporations onboarded",
        date: "2026-03-10"
    },
    {
        id: 3,
        title: "Breaking Barriers",
        category: "accessibility",
        author: "Sarah L.",
        content: "Creating universal design solutions for public transportation systems.",
        impact: "15 Cities transformed",
        date: "2026-01-20"
    },
    {
        id: 4,
        title: "Leadership Reimagined",
        category: "women",
        author: "Elena R.",
        content: "Mentorship programs for women in tech leadership across the globe.",
        impact: "1,200+ Leaders mentored",
        date: "2026-04-05"
    },
    {
        id: 5,
        title: "Empowering Futures",
        category: "youth",
        author: "David K.",
        content: "Vocational training for underprivileged youth in urban centers.",
        impact: "3,000+ Jobs created",
        date: "2026-02-28"
    },
    {
        id: 6,
        title: "Equal Voice",
        category: "work",
        author: "Priya M.",
        content: "Advocating for minority representation in corporate boards.",
        impact: "150% Increase in representation",
        date: "2026-05-01"
    }
];

// 2. STATE MANAGEMENT (Closures)
const AppState = (() => {
    let currentFilter = 'all';
    let isDarkMode = false;

    return {
        getFilter: () => currentFilter,
        setFilter: (val) => { currentFilter = val; },
        toggleTheme: () => { isDarkMode = !isDarkMode; return isDarkMode; }
    };
})();

// 3. CORE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initScrollEffects();
    initTypingEffect();
    initCounters();
    initVoices('all');
    initForm();
    initRevealAnimations();
});

// --- SUB-INITIALIZERS ---

// A. Preloader (Timers & DOM)
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 1000);
    });
}

// B. Scroll Effects (BOM, Event Bubbling, Destructuring)
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const scrollBar = document.getElementById('scroll-bar');
    const backToTop = document.getElementById('back-to-top');

    window.onscroll = () => {
        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";

        // Navbar Styling
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
            backToTop.style.display = 'flex';
        } else {
            navbar.classList.remove('scrolled');
            backToTop.style.display = 'none';
        }

        // Active Link Highlighting
        updateActiveLink();
    };

    // Back to Top Click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile Toggle (Arrow Functions)
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// C. Typing Effect (Recursion & SetTimeout)
function initTypingEffect() {
    const element = document.getElementById('typing-text');
    const text = "Inequalities";
    let index = 0;

    function type() {
        if (index <= text.length) {
            element.textContent = text.slice(0, index);
            index++;
            setTimeout(type, 150);
        } else {
            // Reset and loop after delay
            setTimeout(() => {
                index = 0;
                type();
            }, 3000);
        }
    }
    type();
}

// D. Counters (Intersection Observer, Map/Reduce Concept)
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const options = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const goal = parseInt(target.getAttribute('data-target'));
                animateValue(target, 0, goal, 2000);
                observer.unobserve(target);
            }
        });
    }, options);

    counters.forEach(c => observer.observe(c));

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// E. Voices Filtering (Array Methods: Filter, Sort, Map)
function initVoices(filterType) {
    const grid = document.getElementById('voices-grid');
    
    // 1. Filter Data
    const filtered = filterType === 'all' 
        ? voicesData 
        : voicesData.filter(item => item.category === filterType);

    // 2. Sort Data (By Date Descending)
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Render (Map & Join)
    grid.innerHTML = sorted.map(item => `
        <div class="glass-card equality-card reveal active">
            <span class="badge" style="background:var(--secondary); font-size:0.7rem;">${item.category.toUpperCase()}</span>
            <h3 style="margin-top:15px;">${item.title}</h3>
            <p style="font-size:0.9rem; margin-bottom:15px;">"${item.content}"</p>
            <div style="border-top:1px solid rgba(0,0,0,0.1); padding-top:15px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:var(--primary); font-size:0.8rem;">${item.author}</span>
                <span style="font-size:0.75rem; opacity:0.6;">${item.impact}</span>
            </div>
        </div>
    `).join('');

    // Handle Filter Buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.onclick = () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initVoices(btn.getAttribute('data-filter'));
        };
    });
}

// F. Form Validation (Regex, Promises, JSON)
function initForm() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal');

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        // Destructuring values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Basic Validation
        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        // Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Simulate Async Submission
        const submitData = { name, email, message, timestamp: new Date().toISOString() };
        console.log("Submitting:", JSON.stringify(submitData));

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            showModal();
            form.reset();
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    function showModal() {
        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);
    }

    closeBtn.onclick = () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 500);
    };
}

// G. Reveal Animations (Intersection Observer)
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Progress bar impact section special handling
                const prog = entry.target.querySelector('.impact-progress');
                if (prog) {
                    prog.style.width = prog.getAttribute('data-width');
                }
            }
        });
    }, options);

    reveals.forEach(r => observer.observe(r));
}

// H. Navigation Active Link Update
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(s => {
        const sectionTop = s.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = s.getAttribute('id');
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
}

// EXTRA: Floating Particles Effect (Dynamic DOM)
(function createParticles() {
    const container = document.body;
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 20 + 10;
        Object.assign(p.style, {
            position: 'fixed',
            width: size + 'px',
            height: size + 'px',
            background: 'var(--primary)',
            opacity: '0.05',
            borderRadius: '50%',
            top: Math.random() * 100 + 'vh',
            left: Math.random() * 100 + 'vw',
            pointerEvents: 'none',
            zIndex: '-1',
            animation: `float ${Math.random() * 10 + 5}s linear infinite`
        });
        container.appendChild(p);
    }
})();
