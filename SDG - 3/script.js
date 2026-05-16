// --- TOP SCROLL PROGRESS BAR ---
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    // Calculate total scrollable height
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Calculate percentage scrolled
    const scrollPosition = document.documentElement.scrollTop;
    const progress = (scrollPosition / scrollTotal) * 100;
    // Update progress bar width
    progressBar.style.width = progress + '%';
});


// --- NAVBAR ACTIVE LINK HIGHLIGHTING ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-center a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Check if we have scrolled into the section
        if (pageYOffset >= (sectionTop - 200)) {
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


// --- ANIMATED COUNTERS ---
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

// Function to animate the numbers
const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100; // Adjust speed

        const updateCount = () => {
            const current = +counter.innerText;
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCount, 20); // 20ms delay
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer to trigger counting when stats are visible
const statsSection = document.getElementById('stats');
const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !hasCounted) {
        animateCounters();
        hasCounted = true; // Ensure it only animates once
    }
}, { threshold: 0.5 }); // Trigger when 50% visible

if (statsSection) {
    observer.observe(statsSection);
}


// --- INTERACTIVE BMI CALCULATOR ---
const bmiForm = document.getElementById('bmi-form');
const bmiResultDiv = document.getElementById('bmi-result');
const bmiValueDisplay = document.getElementById('bmi-value');
const bmiCategoryDisplay = document.getElementById('bmi-category');

bmiForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from reloading page

    // Get input values
    const heightCm = parseFloat(document.getElementById('height').value);
    const weightKg = parseFloat(document.getElementById('weight').value);

    // Validate inputs
    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
        alert("Please enter valid positive numbers for height and weight.");
        return;
    }

    // Calculate BMI
    const heightM = heightCm / 100; // Convert cm to meters
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);

    // Determine category and styling
    let category = '';
    let bgColor = '';

    if (bmi < 18.5) {
        category = "Underweight";
        bgColor = "#f39c12"; // Orange
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
        bgColor = "#2ecc71"; // Green (Healthy)
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        bgColor = "#f39c12"; // Orange
    } else {
        category = "Obesity";
        bgColor = "#e74c3c"; // Red
    }

    // Update DOM
    bmiValueDisplay.innerText = bmi;
    bmiCategoryDisplay.innerText = category;
    bmiCategoryDisplay.style.backgroundColor = bgColor;
    
    // Show result div
    bmiResultDiv.classList.remove('hidden');
});
