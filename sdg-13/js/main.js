// main.js - Explaining ES6 variable scoping and basic DOM/BOM manipulation

document.addEventListener('DOMContentLoaded', () => {
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
