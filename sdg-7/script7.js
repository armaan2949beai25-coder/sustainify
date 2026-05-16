
const DOM = {
    loader: document.getElementById('page-loader'),
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('navToggle'),
    navLinks: document.querySelector('.nav-links'),
    themeToggle: document.getElementById('theme-toggle'),
    scrollBar: document.getElementById('scrollBar'),
    backToTop: document.getElementById('back-to-top'),
    calcContainer: document.getElementById('calc-inputs-container'),
    calcBtn: document.getElementById('calculate-btn'),
    tipsContainer: document.getElementById('tips-container'),
    tipsSearch: document.getElementById('tips-search'),
    tipsSort: document.getElementById('tips-sort'),
    pledgeForm: document.getElementById('pledge-form'),
    statsNumbers: document.querySelectorAll('.stat-number'),
    reveals: document.querySelectorAll('.reveal'),
    progressFills: document.querySelectorAll('.progress-fill')
};
let isDarkMode = false; // Boolean
let scrollY = 0; // Number
const appName = "Sustainify"; // String
let undefinedVar; // Undefined (used for demonstration later)
const nullVal = null; // Null
var globalCounter = 0; // var is function/global scoped (avoided generally, used for demo)
const appliances = {
    fan: { name: "Ceiling Fan", wattage: 75, icon: "🌀" },
    ac: { name: "Air Conditioner", wattage: 1500, icon: "❄️" },
    tv: { name: "Television", wattage: 100, icon: "📺" },
    fridge: { name: "Refrigerator", wattage: 150, icon: "🧊" },
    lights: { name: "LED Lights (5x)", wattage: 50, icon: "💡" },
    washingMachine: { name: "Washing Machine", wattage: 500, icon: "🧺" }
};
const energyTips = [
    { id: 1, category: "Appliance", title: "Unplug Idle Electronics", desc: "Devices consume standby power even when turned off.", savings: 10, icon: "🔌" },
    { id: 2, category: "Lighting", title: "Switch to LEDs", desc: "LEDs use 75% less energy than incandescent bulbs.", savings: 15, icon: "💡" },
    { id: 3, category: "Heating/Cooling", title: "Optimize AC Temp", desc: "Set AC to 24°C (75°F) for optimal efficiency.", savings: 20, icon: "🌡️" },
    { id: 4, category: "Appliance", title: "Full Washer Loads", desc: "Only run the washing machine with a full load.", savings: 8, icon: "🧺" },
    { id: 5, category: "Heating/Cooling", title: "Seal Leaks", desc: "Weatherstrip doors and windows to prevent draft.", savings: 12, icon: "🚪" },
    { id: 6, category: "Lighting", title: "Natural Light", desc: "Open blinds during the day to use natural sunlight.", savings: 5, icon: "☀️" }
];
const tipsJSON = JSON.stringify(energyTips);
const parsedTips = JSON.parse(tipsJSON);
const shallowCopy = energyTips; // Points to same memory
const deepCopyAppliance = JSON.parse(JSON.stringify(appliances.ac)); // True independent copy
window.addEventListener('load', () => {
    setTimeout(() => {
        if(DOM.loader) {
            DOM.loader.style.opacity = '0';
            setTimeout(() => DOM.loader.style.display = 'none', 500);
        }
        initApp();
    }, 1000); // Artificial delay to show loader
});

function initApp() {
    console.log(`%cWelcome to ${appName}!`, 'color: #4caf50; font-size: 20px; font-weight: bold;'); // Console methods
    generateCalcInputs();
    renderTips(parsedTips);
    setupEventListeners();
    generateParticles();
    handleScroll();
}
function setupEventListeners() {
    window.addEventListener('scroll', handleScroll);
    if(DOM.navToggle) {
        DOM.navToggle.addEventListener('click', () => {
            DOM.navLinks.classList.toggle('active');
        });
    }
    if(DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    if(DOM.calcBtn) {
        DOM.calcBtn.addEventListener('click', calculateEnergy);
    }
    if(DOM.tipsSearch) {
        DOM.tipsSearch.addEventListener('input', handleTipsFilter);
    }
    if(DOM.tipsSort) {
        DOM.tipsSort.addEventListener('change', handleTipsFilter);
    }
    if(DOM.pledgeForm) {
        DOM.pledgeForm.addEventListener('submit', handleFormSubmit);
    }
    if(DOM.tipsContainer) {
        DOM.tipsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.tip-card');
            if(card) {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => card.style.transform = '', 150);
            }
        });
    }
    if(DOM.backToTop) {
        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // BOM window method
        });
    }
}
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

const handleScroll = () => {
    scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;
    if(DOM.scrollBar) DOM.scrollBar.style.width = `${scrollPercent}%`;
    if (scrollY > 50) {
        DOM.navbar.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        DOM.navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        DOM.navbar.style.top = '0'; // stick to very top
    } else {
        DOM.navbar.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.7)';
        DOM.navbar.style.boxShadow = 'none';
        DOM.navbar.style.top = '4px'; // below progress bar
    }
    if(DOM.backToTop) {
        if(scrollY > 500) DOM.backToTop.classList.add('show');
        else DOM.backToTop.classList.remove('show');
    }
    for (const reveal of DOM.reveals) {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
            if(reveal.id === 'hero' && !reveal.dataset.animated) {
                animateStats();
                reveal.dataset.animated = "true";
            }
            if(reveal.id === 'stats' && !reveal.dataset.animated) {
                animateProgressBars();
                triggerRecursionDemo();
                reveal.dataset.animated = "true";
            }
        }
    }
};

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    if(DOM.themeToggle) {
        DOM.themeToggle.innerHTML = isDarkMode ? '<span class="icon-moon">🌙</span>' : '<span class="icon-sun">☀️</span>';
    }
}

function generateCalcInputs() {
    if(!DOM.calcContainer) return;
    DOM.calcContainer.innerHTML = Object.entries(appliances).map(([key, {name, icon}]) => `
        <div class="calc-item">
            <label>${icon} ${name}</label>
            <div>
                <input type="number" id="input-${key}" min="0" max="24" value="0">
                <small>hrs/day</small>
            </div>
        </div>
    `).join('');
}
const handleTipsFilter = () => {
    const searchTerm = DOM.tipsSearch.value.toLowerCase();
    const categoryFilter = DOM.tipsSort.value;
    const filteredTips = parsedTips
        .filter(tip => {
            const matchesSearch = tip.title.toLowerCase().includes(searchTerm) || tip.desc.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || tip.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => b.savings - a.savings); // Sort by highest savings first

    renderTips(filteredTips);
};

function renderTips(tipsArray) {
    if(!DOM.tipsContainer) return;

    if(tipsArray.length === 0) {
        DOM.tipsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No tips found matching your criteria.</p>';
        return;
    }
    const htmlString = tipsArray.map(tip => `
        <div class="tip-card glow-top" data-id="${tip.id}">
            <div class="tip-header">
                <span class="tip-icon">${tip.icon}</span>
                <span class="section-tag" style="margin:0; font-size:0.7rem;">${tip.category}</span>
            </div>
            <h4>${tip.title}</h4>
            <p>${tip.desc}</p>
            <span class="tip-savings">Saves ~${tip.savings}% energy</span>
        </div>
    `).join('');

    DOM.tipsContainer.innerHTML = htmlString;
}

function calculateEnergy() {
    const usages = [];
    for (const key in appliances) {
        const inputEl = document.getElementById(`input-${key}`);
        let hours = parseFloat(inputEl.value);
        if (isNaN(hours) || hours < 0) hours = 0;
        if (hours > 24) hours = 24;

        usages.push({
            appliance: key,
            wattage: appliances[key].wattage,
            hours: hours
        });
    }
    const totalDailyWh = usages.reduce((total, current) => {
        return total + (current.wattage * current.hours);
    }, 0);
    const dailyKWh = totalDailyWh / 1000;
    const monthlyKWh = dailyKWh * 30;
    const costPerKWh = 0.15; // Assume $0.15 per kWh
    const estimatedBill = monthlyKWh * costPerKWh;
    const carbonFootprint = monthlyKWh * 0.4;

    displayCalcResults(dailyKWh, estimatedBill, carbonFootprint);
}

function displayCalcResults(daily, bill, carbon) {
    document.getElementById('calc-result-placeholder').classList.add('hidden');
    const displayArea = document.getElementById('calc-results-display');
    displayArea.classList.remove('hidden');
    document.getElementById('res-daily').textContent = `${daily.toFixed(2)} kWh`;
    document.getElementById('res-bill').textContent = `$${bill.toFixed(2)}`;
    document.getElementById('res-carbon').textContent = `${carbon.toFixed(1)} kg CO2`;
    const badge = document.getElementById('efficiency-rating');
    let ratingClass = "";
    let ratingText = "";
    switch(true) {
        case (daily === 0):
            ratingText = "No Usage";
            ratingClass = "rating-none";
            break;
        case (daily < 5):
            ratingText = "Excellent Efficiency 🌟";
            ratingClass = "rating-good";
            badge.style.backgroundColor = "var(--secondary)";
            break;
        case (daily >= 5 && daily < 15):
            ratingText = "Average Usage 👍";
            ratingClass = "rating-avg";
            badge.style.backgroundColor = "var(--primary)";
            break;
        default:
            ratingText = "High Consumption ⚠️";
            ratingClass = "rating-poor";
            badge.style.backgroundColor = "#e53e3e";
    }

    badge.textContent = ratingText;
}

function handleFormSubmit(e) {
    e.preventDefault(); // Prevent page reload

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const countryInput = document.getElementById('country');

    let isValid = true;
    if(nameInput.value.trim() === '') {
        showError('name');
        isValid = false;
    } else {
        hideError('name');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(emailInput.value)) {
        showError('email');
        isValid = false;
    } else {
        hideError('email');
    }

    if(isValid) {
        const btn = document.getElementById('submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');

        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        btn.disabled = true;
        simulateApiCall(nameInput.value)
            .then((response) => {
                document.getElementById('form-success').classList.remove('hidden');
                DOM.pledgeForm.reset();
                console.log(response);
            })
            .catch((err) => {
                console.error("Form submission failed:", err);
                alert("Something went wrong. Please try again."); // BOM alert
            })
            .finally(() => {
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');
                btn.disabled = false;
                setTimeout(() => {
                    document.getElementById('form-success').classList.add('hidden');
                }, 5000);
            });
    }
}

function showError(id) {
    document.getElementById(`${id}-error`).style.display = 'block';
    document.getElementById(id).classList.add('invalid');
}

function hideError(id) {
    document.getElementById(`${id}-error`).style.display = 'none';
    document.getElementById(id).classList.remove('invalid');
}
function simulateApiCall(name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(Math.random() > 0.1) {
                resolve(`Success: Pledge recorded for ${name}`);
            } else {
                reject("Network error simulation");
            }
        }, 2000);
    });
}

function animateStats() {
    DOM.statsNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const duration = 2000; // ms
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));
        let current = 0;
        const timer = setInterval(() => {
            current += target / steps;
            if(current >= target) {
                clearInterval(timer);
                stat.textContent = target; // Ensure exact finish
            } else {
                stat.textContent = (target % 1 !== 0) ? current.toFixed(1) : Math.floor(current);
            }
        }, stepTime);
    });
}

function animateProgressBars() {
    DOM.progressFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 100);
    });
}
function calculateCompoundSavings(baseAmount, rate, years, currentYear = 1, total = 0) {
    if (currentYear > years) {
        return total;
    }
    const yearlySavings = baseAmount * Math.pow((1 + rate), currentYear - 1);
    return calculateCompoundSavings(baseAmount, rate, years, currentYear + 1, total + yearlySavings);
}

function triggerRecursionDemo() {
    const outputEl = document.getElementById('recursive-result');
    if(!outputEl) return;
    const result = calculateCompoundSavings(5000, 0.05, 10);

    let counter = 0;
    do {
        counter++;
    } while (counter < 1);
    outputEl.textContent = `${Math.floor(result).toLocaleString()} Tons CO2 Saved`;
}
function generateParticles() {
    const container = document.getElementById('particles-container');
    if(!container) return;

    let i = 0;
    const numParticles = 15;
    while (i < numParticles) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.top = `${posY}vh`;
        particle.style.animation = `floatParticle ${duration}s ease-in-out ${delay}s infinite alternate`;

        container.appendChild(particle);
        i++;
    }
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floatParticle {
            0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
            50% { transform: translate(${Math.random()*50}px, -${Math.random()*50}px) scale(1.5); opacity: 0.6; }
            100% { transform: translate(-${Math.random()*50}px, -${Math.random()*100}px) scale(0.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
function syllabusDemoLoops() {
    for(let i=0; i<10; i++) {
        if(i === 3) continue; // Skip 3
        if(i === 8) break; // Stop at 8
    }
}
syllabusDemoLoops();
