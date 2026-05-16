// DOM Elements
const progressBar = document.getElementById('myBar');
const accordionHeaders = document.querySelectorAll('.accordion-header');
const pledgeForm = document.getElementById('pledge-form');
const formMessage = document.getElementById('form-message');

// 1. Progress Tracker
window.addEventListener('scroll', () => {
    // Calculate how far the user has scrolled
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Calculate the total scrollable height
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Calculate the scroll percentage
    const scrolled = (winScroll / height) * 100;
    
    // Update the width of the progress bar
    progressBar.style.width = scrolled + "%";
});

// 2. Accordion Functionality
accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        // Toggle the 'active' class on the clicked header
        this.classList.toggle('active');
        
        // Get the next element (the content pane)
        const content = this.nextElementSibling;
        
        // Toggle the max-height for smooth transition
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

// 3. Form Submission Handling
if (pledgeForm) {
    pledgeForm.addEventListener('submit', function(e) {
        // Prevent actual form submission to server
        e.preventDefault();
        
        // Get form values
        const nameInput = document.getElementById('name').value;
        const typeInput = document.getElementById('partnership-type').value;
        
        // Simple validation (though required attribute handles most)
        if (nameInput && typeInput) {
            // Display success message
            formMessage.textContent = `Thank you, ${nameInput}! Your pledge for ${typeInput.replace('-', ' ')} has been recorded. Let's work together for the goals!`;
            formMessage.className = 'message-box success';
            formMessage.classList.remove('hidden');
            
            // Reset the form
            pledgeForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.className = 'hidden message-box';
            }, 5000);
        }
    });
}
