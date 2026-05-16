/**
 * SUSTAINIFY | SDG 9 - script9.js
 * Logic for Industry, Innovation & Infrastructure web application.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA INITIALIZATION
    const innovations = [
        { id: 1, name: "Neural Link Robotics", category: "ai", relevance: 95, desc: "Direct brain-computer interfaces for industrial robot control.", icon: "fa-robot" },
        { id: 2, name: "Quantum Smart Grids", category: "energy", relevance: 88, desc: "Infinite scaling energy distribution using quantum computing.", icon: "fa-bolt" },
        { id: 3, name: "Hyperloop Logistics", category: "digital", relevance: 92, desc: "Vaccuum-sealed transport for near-supersonic freight delivery.", icon: "fa-truck-fast" },
        { id: 4, name: "Bio-Synthetic Concrete", category: "energy", relevance: 85, desc: "Self-healing building materials that absorb CO2.", icon: "fa-seedling" },
        { id: 5, name: "Swarm AI Manufacturing", category: "ai", relevance: 98, desc: "Decentralized AI agents coordinating factory floor logistics.", icon: "fa-microchip" },
        { id: 6, name: "6G Satellite Mesh", category: "digital", relevance: 90, desc: "Global ultra-low latency connectivity via orbital networks.", icon: "fa-satellite" }
    ];

    // 2. DOM ELEMENTS
    const loader = document.getElementById('loader');
    const scrollBar = document.getElementById('scroll-progress-bar');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-links');
    const backToTop = document.getElementById('back-to-top');
    const innovationGrid = document.getElementById('innovation-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-innovation');


    // 3. LOADER & ASYNC INITIALIZATION
    const initializeApp = async () => {
        try {
            // Simulate data fetching or resource loading
            await new Promise(resolve => setTimeout(resolve, 1500));
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
            renderInnovations(innovations);
            startTypingEffect();
        } catch (error) {
            console.error("Initialization failed:", error);
        }
    };

    // 4. SCROLL EVENTS (Progress Bar, Navbar, Reveal)
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";

        // Navbar Scroll Effect
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }

        // Active Link & Scroll Reveal
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (winScroll >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
            // Scroll Reveal Logic
            if (winScroll > sectionTop - window.innerHeight + 100) {
                section.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
                // Trigger counters if in stats section
                if (section.id === 'stats') startCounters();
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 5. THEME (Light Only — no toggle needed)

    // 6. INNOVATION SHOWCASE RENDERING (Map, Filter, Sort)
    const renderInnovations = (data) => {
        innovationGrid.innerHTML = data.map(item => `
            <div class="innov-card glass-card" data-category="${item.category}">
                <div class="card-icon"><i class="fas ${item.icon}"></i></div>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="card-meta">
                    <span class="relevance">Relevance: ${item.relevance}%</span>
                </div>
            </div>
        `).join('');
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            
            const filteredData = filter === 'all' 
                ? innovations 
                : innovations.filter(item => item.category === filter);
            
            renderInnovations(filteredData);
        });
    });

    sortSelect.addEventListener('change', (e) => {
        const criteria = e.target.value;
        const sortedData = [...innovations].sort((a, b) => {
            if (criteria === 'name') return a.name.localeCompare(b.name);
            return b.relevance - a.relevance;
        });
        renderInnovations(sortedData);
    });

    // 7. COUNTER ANIMATION
    let countersStarted = false;
    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = 200;
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // 8. TYPING EFFECT
    const startTypingEffect = () => {
        const subtitle = document.getElementById('hero-subtitle');
        const text = subtitle.textContent;
        subtitle.textContent = "";
        let i = 0;
        const type = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, 30);
            }
        };
        type();
    };



    // 10. MOBILE NAV
    hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Start App
    initializeApp();
});
