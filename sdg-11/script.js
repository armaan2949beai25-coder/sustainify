// SDG 11: Sustainable Cities and Communities
// JavaScript Logic demonstrating syllabus concepts

// ---------------------------------------------------------
// FEATURE: Scroll Progress Tracker (BOM & DOM Manipulation)
// ---------------------------------------------------------
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// ---------------------------------------------------------
// FEATURE 1: Dynamic Target Explorer (HOFs, Arrays, DOM)
// ---------------------------------------------------------

// Data Type: Array of Objects
const sdgTargets = [
    { id: 1, category: 'housing', icon: '🏠', title: 'Safe and Affordable Housing', desc: 'Ensure access for all to adequate, safe and affordable housing and basic services and upgrade slums.' },
    { id: 2, category: 'transport', icon: '🚌', title: 'Sustainable Transport Systems', desc: 'Provide access to safe, affordable, accessible and sustainable transport systems for all.' },
    { id: 3, category: 'environment', icon: '🌳', title: 'Reduce Environmental Impact', desc: 'Reduce the adverse per capita environmental impact of cities, paying special attention to air quality.' },
    { id: 4, category: 'environment', icon: '♻️', title: 'Waste Management', desc: 'Pay special attention to municipal and other waste management.' },
    { id: 5, category: 'housing', icon: '🏙️', title: 'Inclusive Urbanization', desc: 'Enhance inclusive and sustainable urbanization and capacity for participatory, integrated and sustainable human settlement planning.' },
    { id: 6, category: 'transport', icon: '🚲', title: 'Non-Motorized Transport', desc: 'Expand public transport, with special attention to the needs of those in vulnerable situations.' }
];

const targetsContainer = document.getElementById('targets-container');
const filterControls = document.getElementById('filter-controls');

// Function Declaration & Arrow Function
const renderTargets = (targetsToRender) => {
    // DOM Manipulation: clear existing nodes
    targetsContainer.innerHTML = '';
    
    // Higher Order Function: map
    targetsToRender.map(target => {
        // DOM Manipulation: creating and appending nodes
        const card = document.createElement('div');
        card.className = 'target-card';
        
        card.innerHTML = `
            <div class="target-icon">${target.icon}</div>
            <h3>${target.title}</h3>
            <p>${target.desc}</p>
        `;
        
        targetsContainer.appendChild(card);
    });
};

// Initial Render
renderTargets(sdgTargets);

// Event Delegation for Filter Buttons
filterControls.addEventListener('click', (e) => {
    // Check if clicked element is a button
    if(e.target.tagName === 'BUTTON') {
        // Update active class
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const selectedCategory = e.target.getAttribute('data-category');
        
        // Control flow (if/else) & Higher Order Function (filter)
        if(selectedCategory === 'all') {
            renderTargets(sdgTargets);
        } else {
            const filteredTargets = sdgTargets.filter(target => target.category === selectedCategory);
            renderTargets(filteredTargets);
        }
    }
});

// ---------------------------------------------------------
// FEATURE 2: Assessment Form (Event Handling, Validation)
// ---------------------------------------------------------

const assessmentForm = document.getElementById('assessment-form');
const resultSection = document.getElementById('assessment-result');
const resetBtn = document.getElementById('reset-btn');

assessmentForm.addEventListener('submit', function(e) {
    // Prevent default submission
    e.preventDefault();
    
    // Reset previous errors
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    
    // DOM Selectors
    const cityInput = document.getElementById('city-name');
    const transportInput = document.getElementById('public-transport');
    const greenInput = document.getElementById('green-spaces');
    const wasteInput = document.getElementById('waste-management');
    
    let isValid = true;
    
    // Form Validation logic
    if(cityInput.value.trim() === '') {
        document.getElementById('city-error').textContent = 'City name is required.';
        isValid = false;
    }
    
    // Validate number inputs (1-10)
    const validateNumber = (input, errorId) => {
        const val = parseInt(input.value);
        if(isNaN(val) || val < 1 || val > 10) {
            document.getElementById(errorId).textContent = 'Please enter a number between 1 and 10.';
            isValid = false;
        }
        return val;
    };
    
    const transportScore = validateNumber(transportInput, 'transport-error');
    const greenScore = validateNumber(greenInput, 'green-error');
    const wasteScore = validateNumber(wasteInput, 'waste-error');
    
    // Calculate if valid
    if(isValid) {
        // Operators and expressions
        const totalScore = transportScore + greenScore + wasteScore;
        
        // Update DOM
        document.getElementById('result-city').textContent = cityInput.value;
        document.getElementById('final-score').textContent = totalScore;
        
        let message = '';
        if(totalScore >= 25) {
            message = "Excellent! Your city is highly sustainable.";
        } else if(totalScore >= 15) {
            message = "Good progress, but room for improvement.";
        } else {
            message = "Significant action is needed for sustainability.";
        }
        
        document.getElementById('score-message').textContent = message;
        
        // Hide form, show result
        assessmentForm.classList.add('hidden');
        resultSection.classList.remove('hidden');
    }
});

resetBtn.addEventListener('click', () => {
    assessmentForm.reset();
    resultSection.classList.add('hidden');
    assessmentForm.classList.remove('hidden');
});

// ---------------------------------------------------------
// FEATURE 3: Global Insights (Promises, Async, JSON)
// ---------------------------------------------------------

const loadInsightsBtn = document.getElementById('load-insights-btn');
const loader = document.getElementById('loader');
const insightsContent = document.getElementById('insights-content');

// Mock JSON Data as string
const mockJSONData = `
{
    "cityName": "Copenhagen",
    "country": "Denmark",
    "metrics": {
        "co2Emissions": "Low",
        "renewableEnergy": "70%",
        "publicTransitUsage": "Very High",
        "airQualityIndex": "Excellent"
    }
}
`;

// Function returning a Promise to simulate network request
const fetchCityData = () => {
    return new Promise((resolve, reject) => {
        // BOM: timers (setTimeout)
        setTimeout(() => {
            try {
                // JSON Handling
                const parsedData = JSON.parse(mockJSONData);
                resolve(parsedData);
            } catch (error) {
                reject("Failed to parse data");
            }
        }, 1500); // 1.5 second delay
    });
};

loadInsightsBtn.addEventListener('click', () => {
    // UI state updates
    loadInsightsBtn.classList.add('hidden');
    loader.classList.remove('hidden');
    insightsContent.innerHTML = '';
    
    // Using Promise lifecycle
    fetchCityData()
        .then(data => {
            // Destructuring object
            const { cityName, country, metrics } = data;
            
            // Read/write HTML
            insightsContent.innerHTML = `
                <h3>${cityName}, ${country}</h3>
                <div class="city-stat">
                    <span class="stat-label">CO2 Emissions</span>
                    <span class="stat-value">${metrics.co2Emissions}</span>
                </div>
                <div class="city-stat">
                    <span class="stat-label">Renewable Energy</span>
                    <span class="stat-value">${metrics.renewableEnergy}</span>
                </div>
                <div class="city-stat">
                    <span class="stat-label">Public Transit</span>
                    <span class="stat-value">${metrics.publicTransitUsage}</span>
                </div>
                <div class="city-stat">
                    <span class="stat-label">Air Quality Index</span>
                    <span class="stat-value">${metrics.airQualityIndex}</span>
                </div>
            `;
            loader.classList.add('hidden');
            insightsContent.classList.remove('hidden');
        })
        .catch(err => {
            // Error handling
            insightsContent.innerHTML = `<p class="error-msg">Error: ${err}</p>`;
            loader.classList.add('hidden');
            insightsContent.classList.remove('hidden');
            loadInsightsBtn.classList.remove('hidden');
            loadInsightsBtn.textContent = 'Try Again';
        });
});
