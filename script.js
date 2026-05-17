// script.js

// 1. Array of Objects representing the 17 SDGs with official colors
const sdgs = [
    { id: 1, title: "No Poverty", color: "#E5243B", icon: "fa-solid fa-users-slash", desc: "End poverty in all its forms everywhere." },
    { id: 2, title: "Zero Hunger", color: "#DDA63A", icon: "fa-solid fa-bowl-rice", desc: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture." },
    { id: 3, title: "Good Health and Well-being", color: "#4C9F38", icon: "fa-solid fa-heart-pulse", desc: "Ensure healthy lives and promote well-being for all at all ages." },
    { id: 4, title: "Quality Education", color: "#C5192D", icon: "fa-solid fa-book-open", desc: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all." },
    { id: 5, title: "Gender Equality", color: "#FF3A21", icon: "fa-solid fa-venus-mars", desc: "Achieve gender equality and empower all women and girls." },
    { id: 6, title: "Clean Water and Sanitation", color: "#26BDE2", icon: "fa-solid fa-faucet-drip", desc: "Ensure availability and sustainable management of water and sanitation for all." },
    { id: 7, title: "Affordable and Clean Energy", color: "#FCC30B", icon: "fa-solid fa-solar-panel", desc: "Ensure access to affordable, reliable, sustainable and modern energy for all." },
    { id: 8, title: "Decent Work and Economic Growth", color: "#A21942", icon: "fa-solid fa-chart-line", desc: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all." },
    { id: 9, title: "Industry, Innovation and Infrastructure", color: "#FD6925", icon: "fa-solid fa-industry", desc: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation." },
    { id: 10, title: "Reduced Inequality", color: "#DD1367", icon: "fa-solid fa-equals", desc: "Reduce inequality within and among countries." },
    { id: 11, title: "Sustainable Cities and Communities", color: "#FD9D24", icon: "fa-solid fa-city", desc: "Make cities and human settlements inclusive, safe, resilient and sustainable." },
    { id: 12, title: "Responsible Consumption and Production", color: "#BF8B2E", icon: "fa-solid fa-recycle", desc: "Ensure sustainable consumption and production patterns." },
    { id: 13, title: "Climate Action", color: "#3F7E44", icon: "fa-solid fa-earth-americas", desc: "Take urgent action to combat climate change and its impacts." },
    { id: 14, title: "Life Below Water", color: "#0A97D9", icon: "fa-solid fa-water", desc: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development." },
    { id: 15, title: "Life on Land", color: "#56C02B", icon: "fa-solid fa-tree", desc: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation." },
    { id: 16, title: "Peace, Justice and Strong Institutions", color: "#00689D", icon: "fa-solid fa-scale-balanced", desc: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions." },
    { id: 17, title: "Partnerships for the Goals", color: "#19486A", icon: "fa-solid fa-handshake", desc: "Strengthen the means of implementation and revitalize the global partnership for sustainable development." }
];

// 2. DOM Elements
const sdgGrid = document.getElementById('sdg-grid');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');

// 3. Sticky Navbar & Active Link effect on scroll
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Active link highlighting
    let current = '';
    document.querySelectorAll('section, main').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    if (navLinks) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }
});

// 4. Render SDG Cards dynamically with Staggered Delays
function renderSDGs() {
    if (!sdgGrid) return;
    
    const cardsHTML = sdgs.map((sdg, index) => {
        const pageLink = `./sdg-${sdg.id}/index.html`; 
        const delayClass = `delay-${(index % 4) + 1}`; // Staggered delays 1,2,3,4
        
        return `
            <a href="${pageLink}" class="sdg-card reveal ${delayClass}" style="--sdg-color: ${sdg.color};">
                <span class="sdg-number">${sdg.id}</span>
                <div class="sdg-card-header">
                    <div class="sdg-icon-wrapper">
                        <i class="${sdg.icon}"></i>
                    </div>
                </div>
                <h3>${sdg.title}</h3>
                <p>${sdg.desc}</p>
                <div class="sdg-link">
                    Explore Goal <i class="fa-solid fa-arrow-right"></i>
                </div>
            </a>
        `;
    }).join('');

    sdgGrid.innerHTML = cardsHTML;
}

// 5. Scroll Reveal Animation & Counters
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter, .counter-mini');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a dashboard section or about section, trigger counters inside
                const sectionCounters = entry.target.querySelectorAll('.counter, .counter-mini');
                if(sectionCounters.length > 0) {
                    sectionCounters.forEach(counter => {
                        if (!counter.classList.contains('counted')) {
                            animateCounter(counter);
                            counter.classList.add('counted');
                        }
                    });
                }
                // Observer can be stopped for pure reveals, but we might want them to re-trigger?
                // The prompt says premium animated, usually they trigger once.
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
}

function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.innerText = target;
        }
    };
    
    updateCounter();
}

// 6. Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 7. Hero Parallax Effect
function initParallax() {
    const hero = document.getElementById('home');
    const layers = document.querySelectorAll('.parallax-layer');

    if (hero && layers.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            layers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 1;
                layer.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
            });
        });
        
        hero.addEventListener('mouseleave', () => {
            layers.forEach(layer => {
                layer.style.transform = `translateX(0px) translateY(0px)`;
                layer.style.transition = `transform 0.5s ease`;
            });
        });
        
        hero.addEventListener('mouseenter', () => {
            layers.forEach(layer => {
                layer.style.transition = `none`;
            });
        });
    }
}

// 8. Enhanced Network Canvas Animation
function initNetworkCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = document.getElementById('home').offsetHeight || window.innerHeight;
    let particles = [];
    
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 100;
    const maxDistance = 150;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.getElementById('home').offsetHeight || window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(37, 99, 235, 0.5)' : 'rgba(16, 185, 129, 0.5)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            if (mouse.x != null && mouse.y != null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// 9. Carousel Logic
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if(!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cards = track.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    
    function updateCarousel() {
        // Calculate card width including gap.
        // Gap is 2rem = 32px
        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        const moveAmount = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveAmount}px)`;
    }
    
    nextBtn.addEventListener('click', () => {
        // Assuming 3 cards visible on desktop, 1 on mobile
        const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (currentIndex < totalCards - visibleCards) {
            currentIndex++;
            updateCarousel();
        } else {
            currentIndex = 0; // loop back
            updateCarousel();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else {
            currentIndex = totalCards - visibleCards;
            updateCarousel();
        }
    });
    
    window.addEventListener('resize', updateCarousel);
}

// 10. Simple Quiz Interaction
function initQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    const quizArea = document.getElementById('quiz-area');
    
    if(startBtn && quizArea) {
        startBtn.addEventListener('click', () => {
            quizArea.innerHTML = `
                <div style="animation: fadeInUp 0.5s ease forwards;">
                    <h3 style="margin-bottom: 1rem;">Question 1: What matters most to you?</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; text-align: left;">
                        <button class="btn btn-outline" style="text-align:left; border-radius:10px;">A) Protecting Nature & Wildlife</button>
                        <button class="btn btn-outline" style="text-align:left; border-radius:10px;">B) Ending Poverty & Hunger</button>
                        <button class="btn btn-outline" style="text-align:left; border-radius:10px;">C) Education & Equality</button>
                    </div>
                </div>
            `;
            
            // Just a visual mock of interactivity
            const newBtns = quizArea.querySelectorAll('button');
            newBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    quizArea.innerHTML = `
                        <div style="animation: fadeInUp 0.5s ease forwards;">
                            <h3 style="color: #10b981; margin-bottom: 1rem;"><i class="fa-solid fa-leaf"></i> Your Match: Climate Action (SDG 13)</h3>
                            <p>You have a strong passion for protecting our planet! Start exploring SDG 13 to see how you can help.</p>
                            <a href="#explore" class="btn btn-primary btn-glow" style="margin-top: 1rem;">Explore Goals</a>
                        </div>
                    `;
                });
            });
        });
    }
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    renderSDGs();
    // setTimeout to allow dynamic cards to be injected into DOM before observing
    setTimeout(() => {
        initScrollReveals();
    }, 100);
    initMobileMenu();
    initParallax();
    initNetworkCanvas();
    initCarousel();
    initQuiz();
});
