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

// 3. Sticky Navbar effect on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active link highlighting
    let current = '';
    document.querySelectorAll('section, main, footer').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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

// 4. Render SDG Cards dynamically
function renderSDGs() {
    if (!sdgGrid) return;
    
    const cardsHTML = sdgs.map(sdg => {
        const pageLink = `../SDG - ${sdg.id}/index.html`; 
        
        return `
            <a href="${pageLink}" class="sdg-card" style="--sdg-color: ${sdg.color}; text-decoration: none; color: inherit;">
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

// 5. Scroll Reveal Animation using IntersectionObserver
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    renderSDGs();
    initScrollReveals();
});
