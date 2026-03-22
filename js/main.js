// main.js - Explaining ES6 variable scoping and basic DOM/BOM manipulation

document.addEventListener('DOMContentLoaded', () => {
    // Variable scoping demonstration
    const menuBtn = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    // Global Event Handling
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            // let helps us reassign scope-level values if needed, 
            // but toggling class is direct DOM manipulation
            mobileNav.classList.toggle('active');
            
            // BOM manipulation (logging navigation state or simple toggles)
            const icon = menuBtn.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    }

    // BOM integration hint: Start Calculating button on Home Page jumps to calc
    const startBtn = document.getElementById('startCalcBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Using BOM interface location
            window.location.href = 'calculator.html';
        });
    }

    // Intersection Observer for scroll animations (DOM manipulation + Async execution behavior)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    const animatedEls = document.querySelectorAll('.glass-card, .hover-glow');
    animatedEls.forEach(el => observer.observe(el));
});
