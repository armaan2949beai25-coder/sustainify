
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    const links = navLinks.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    }
}
const navbar = document.getElementById('navbar');
const scrollProgressBar = document.getElementById('scroll-progress-bar');

window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = scrollPercent + '%';
});

const calcBtn = document.getElementById('calc-btn');
const calcResult = document.getElementById('calc-result');

function calculateWater() {
    const people = parseInt(document.getElementById('calc-people').value) || 0;
    const bathing = parseFloat(document.getElementById('calc-bathing').value) || 0;
    const washing = parseFloat(document.getElementById('calc-washing').value) || 0;
    const drinking = parseFloat(document.getElementById('calc-drinking').value) || 0;
    if (people <= 0) {
        calcResult.innerHTML = '<div class="result-placeholder"><span class="result-icon">⚠️</span><p>Please enter at least <strong>1 person</strong>.</p></div>';
        return;
    }

    const totalBathing = people * bathing;
    const totalWashing = people * washing;
    const totalDrinking = people * drinking;
    const total = totalBathing + totalWashing + totalDrinking;
    let message = '';
    if (total === 0) {
        message = 'Enter your usage values above to see a breakdown.';
    } else if (total < 100) {
        message = '🌟 Excellent! Your household uses very little water. Keep it up!';
    } else if (total < 300) {
        message = '👍 Good job! Your water usage is moderate. Small changes can help even more.';
    } else if (total < 600) {
        message = '💡 Your usage is above average. Consider shorter showers and fixing leaks.';
    } else {
        message = '⚠️ High usage detected. Try reducing bathing time and reusing wash water.';
    }

    calcResult.innerHTML = `
        <div class="calc-result-display">
            <div class="result-total">${total}</div>
            <div class="result-unit">litres / day</div>
            <div class="result-breakdown">
                <div class="breakdown-row"><span>🚿 Bathing</span><span>${totalBathing} L</span></div>
                <div class="breakdown-row"><span>🧺 Washing</span><span>${totalWashing} L</span></div>
                <div class="breakdown-row"><span>🥤 Drinking</span><span>${totalDrinking} L</span></div>
            </div>
            <div class="result-message">${message}</div>
        </div>
    `;
}

calcBtn.addEventListener('click', calculateWater);

const tipsData = [
    {
        emoji: '🚿',
        title: 'Shorter Showers',
        description: 'Reducing your shower time by just 2 minutes can save up to 40 litres of water per shower. Use a timer to keep track!'
    },
    {
        emoji: '🚰',
        title: 'Fix Leaky Taps',
        description: 'A dripping tap can waste over 5,000 litres of water a year. Check your taps regularly and replace worn washers.'
    },
    {
        emoji: '🪥',
        title: 'Turn Off While Brushing',
        description: 'Turning off the tap while brushing your teeth can save up to 8 litres of water per minute. Use a cup instead.'
    },
    {
        emoji: '🌱',
        title: 'Water Plants Wisely',
        description: 'Water your garden early morning or late evening to reduce evaporation. Use drip irrigation or a watering can.'
    },
    {
        emoji: '🍽️',
        title: 'Full Loads Only',
        description: 'Run washing machines and dishwashers only when full. This can save up to 50 litres per load.'
    },
    {
        emoji: '🪣',
        title: 'Collect Rainwater',
        description: 'Set up a rain barrel to collect water for gardening and cleaning. Every bit of harvested rainwater counts!'
    }
];

const tipsGrid = document.getElementById('tips-grid');

function renderTips() {
    tipsGrid.innerHTML = tipsData.map(tip => `
        <div class="tip-card">
            <div class="tip-emoji">${tip.emoji}</div>
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
        </div>
    `).join('');
}

renderTips();

const regionSelect = document.getElementById('region-select');
const regionInfo = document.getElementById('region-info');

function showRegionInfo() {
    const region = regionSelect.value;

    if (!region) {
        regionInfo.innerHTML = `
            <div class="result-placeholder">
                <span class="result-icon">🗺️</span>
                <p>Select a region from the dropdown to learn about its water scarcity challenges.</p>
            </div>
        `;
        return;
    }

    let name = '';
    let severity = '';
    let sevClass = '';
    let desc = '';
    let stat1 = '';
    let stat1Lbl = '';
    let stat2 = '';
    let stat2Lbl = '';

    switch (region) {
        case 'india':
            name = '🇮🇳 India';
            severity = 'High Stress';
            sevClass = 'high';
            desc = 'India faces severe water stress with over 600 million people experiencing high-to-extreme water scarcity. Groundwater depletion, pollution of rivers, and uneven monsoon patterns make access to clean water a daily challenge for millions.';
            stat1 = '600M+';
            stat1Lbl = 'Affected People';
            stat2 = '70%';
            stat2Lbl = 'Water Contaminated';
            break;

        case 'africa':
            name = '🌍 Africa';
            severity = 'Very High Stress';
            sevClass = 'very-high';
            desc = 'Sub-Saharan Africa has the largest number of water-stressed countries. Over 400 million people lack access to basic drinking water, and women and girls spend an estimated 200 million hours daily collecting water.';
            stat1 = '400M+';
            stat1Lbl = 'Lack Clean Water';
            stat2 = '40%';
            stat2Lbl = 'Without Sanitation';
            break;

        case 'middle-east':
            name = '🏜️ Middle East';
            severity = 'Extreme Stress';
            sevClass = 'extreme';
            desc = 'The Middle East is the most water-scarce region on Earth. Countries like Yemen, Jordan, and Iraq face extreme stress due to arid climates, rapid population growth, and conflict disrupting water infrastructure.';
            stat1 = '83%';
            stat1Lbl = 'Under Extreme Stress';
            stat2 = '12';
            stat2Lbl = 'Countries Affected';
            break;

        default:
            regionInfo.innerHTML = '<div class="result-placeholder"><span class="result-icon">❓</span><p>Region not found.</p></div>';
            return;
    }

    regionInfo.innerHTML = `
        <div class="region-detail">
            <h3>${name}</h3>
            <span class="region-severity ${sevClass}">${severity}</span>
            <p>${desc}</p>
            <div class="region-stats">
                <div class="region-stat">
                    <div class="stat-val">${stat1}</div>
                    <div class="stat-lbl">${stat1Lbl}</div>
                </div>
                <div class="region-stat">
                    <div class="stat-val">${stat2}</div>
                    <div class="stat-lbl">${stat2Lbl}</div>
                </div>
            </div>
        </div>
    `;
}

regionSelect.addEventListener('change', showRegionInfo);

const tdsBtn = document.getElementById('tds-btn');
const tdsInput = document.getElementById('tds-input');
const qualityResult = document.getElementById('quality-result');

function checkWaterQuality() {
    const tds = parseFloat(tdsInput.value);

    if (isNaN(tds) || tds < 0) {
        qualityResult.innerHTML = '<div class="result-placeholder"><span class="result-icon">⚠️</span><p>Please enter a valid TDS value (0 or above).</p></div>';
        return;
    }

    let status = '';
    let emoji = '';
    let cssClass = '';
    let message = '';

    if (tds < 300) {
        status = 'Safe';
        emoji = '✅';
        cssClass = 'safe';
        message = 'Your water has a low TDS level and is generally considered safe for drinking. Great quality!';
    } else if (tds <= 600) {
        status = 'Moderate';
        emoji = '⚠️';
        cssClass = 'moderate';
        message = 'Your water TDS is moderate. It\'s acceptable but consider using a filter for better taste and purity.';
    } else {
        status = 'Unsafe';
        emoji = '❌';
        cssClass = 'unsafe';
        message = 'High TDS detected! This water may contain harmful dissolved solids. Use a RO purifier or find an alternative source.';
    }

    qualityResult.innerHTML = `
        <div class="quality-display">
            <div class="quality-badge ${cssClass}">${emoji}</div>
            <div class="quality-status ${cssClass}">${status}</div>
            <div class="quality-msg">${message}</div>
            <div class="quality-tds-val">TDS Value: ${tds} mg/L</div>
        </div>
    `;
}

tdsBtn.addEventListener('click', checkWaterQuality);

const actions = [
    'Turn off taps while brushing teeth',
    'Take showers under 5 minutes',
    'Fix any leaking taps or pipes at home',
    'Use a bucket instead of a hose for car washing',
    'Run washing machine only with full loads',
    'Collect and reuse kitchen water for plants',
    'Install water-efficient showerheads',
    'Report water waste in your community',
    'Educate a friend or family member about water conservation',
    'Avoid using bottled water when tap water is safe'
];

const actionList = document.getElementById('action-list');
const actionCount = document.getElementById('action-count');
const actionTotal = document.getElementById('action-total');
const progressBar = document.getElementById('progress-bar');
actionTotal.textContent = actions.length;

function renderActions() {
    actionList.innerHTML = actions.map((action, i) => `
        <div class="action-item">
            <input type="checkbox" id="action-${i}" data-index="${i}">
            <label for="action-${i}">${action}</label>
        </div>
    `).join('');
    actionList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', updateActionCount));
}

function updateActionCount() {
    const checked = actionList.querySelectorAll('input[type="checkbox"]:checked').length;
    actionCount.textContent = checked;
    progressBar.style.width = (checked / actions.length) * 100 + '%';
}

renderActions();

const streakBtn = document.getElementById('streak-btn');
const streakNumber = document.getElementById('streak-number');
const streakInfo = document.getElementById('streak-info');
const streakHistory = document.getElementById('streak-history');
const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
function getTodayString() { return formatDate(new Date()); }
function getYesterdayString() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return formatDate(d);
}
function loadStreak() {
    let streak = 0;
    let lastDate = '';

    try {
        streak = parseInt(localStorage.getItem('sdg6_streak')) || 0;
        lastDate = localStorage.getItem('sdg6_lastDate') || '';
    } catch (e) {
        streak = 0;
        lastDate = '';
    }

    const today = getTodayString();
    const yesterday = getYesterdayString();
    if (lastDate !== today && lastDate !== yesterday) {
        streak = 0;
    }

    return { streak: streak, lastDate: lastDate };
}
function saveStreak(streak, lastDate) {
    try {
        localStorage.setItem('sdg6_streak', streak);
        localStorage.setItem('sdg6_lastDate', lastDate);
    } catch (e) {
    }
}
function updateStreakDisplay() {
    const data = loadStreak();
    const today = getTodayString();

    streakNumber.textContent = data.streak;

    if (data.lastDate === today) {
        streakInfo.textContent = '✅ You already marked today! Come back tomorrow.';
        streakBtn.classList.add('streak-btn-disabled');
    } else {
        streakInfo.textContent = 'Click the button to mark today as a water-saving day!';
        streakBtn.classList.remove('streak-btn-disabled');
    }
    if (data.lastDate) {
        streakHistory.textContent = 'Last marked: ' + data.lastDate;
    } else {
        streakHistory.textContent = '';
    }
}

function markStreak() {
    const data = loadStreak();
    const today = getTodayString();
    if (data.lastDate === today) {
        return;
    }

    let newStreak = 1;
    const yesterday = getYesterdayString();

    if (data.lastDate === yesterday) {
        newStreak = data.streak + 1;
    } else {
        newStreak = 1;
    }

    saveStreak(newStreak, today);
    updateStreakDisplay();
}

streakBtn.addEventListener('click', markStreak);
updateStreakDisplay();
