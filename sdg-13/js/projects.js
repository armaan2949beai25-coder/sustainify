document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projectsGrid');
    const loadingState = document.getElementById('loadingProjects');
    const errorState = document.getElementById('errorState');
    const errorMsg = document.getElementById('errorMsg');
    const categoryFilter = document.getElementById('categoryFilter');
    const projectStats = document.getElementById('projectStats');
    const retryBtn = document.getElementById('retryBtn');

    // MOCK DATA structure containing complex structures for Object Manipulation
    const mockDb = [
        {
            id: 'proj_1',
            title: 'Amazon Reforestation',
            category: 'reforestation',
            country_code: 'br',
            description: 'Restoring native trees in heavily deforested regions of the Amazon basin.',
            impact: 12000,
            unit: 'Tons CO₂e/yr',
            verified: true,
            image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=500&q=80'
        },
        {
            id: 'proj_2',
            title: 'Maasai Solar Electrification',
            category: 'renewable',
            country_code: 'ke',
            description: 'Bringing clean, renewable solar power to off-grid communities.',
            impact: 4500,
            unit: 'Tons CO₂e/yr',
            verified: true,
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80'
        },
        {
            id: 'proj_3',
            title: 'Ocean Plastic Recovery',
            category: 'community',
            country_code: 'id',
            description: 'Empowering local communities to extract and recycle oceanic plastic waste.',
            impact: 890,
            unit: 'Tons CO₂e/yr',
            verified: false,
            image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&q=80'
        },
        {
            id: 'proj_4',
            title: 'Wind Farm Initiative EU',
            category: 'renewable',
            country_code: 'de',
            description: 'Building offshore wind farms to reduce dependency on coal grids across Europe.',
            impact: 25000,
            unit: 'Tons CO₂e/yr',
            verified: true,
            image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=500&q=80'
        },
        {
            id: 'proj_5',
            title: 'Urban Organic Composting',
            category: 'community',
            country_code: 'us',
            description: 'Implementing city-wide organic waste diversion programs.',
            impact: 1200,
            unit: 'Tons CO₂e/yr',
            verified: true,
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80'
        }
    ];

    // State Tracking
    let allProjects = [];

    // Helper: Build UI elements dynamically
    const buildProjectCard = (projectData) => {
        // Destructuring Assignments
        const { title, category, description, impact, unit, image, verified, countryInfo } = projectData;
        
        const card = document.createElement('div');
        card.className = 'glass-card project-card fade-in-up';
        
        card.innerHTML = `
            <div class="project-img-container">
                <img src="${image}" alt="${title}" class="project-img">
                ${countryInfo ? `
                    <div class="country-pill">
                        <img src="${countryInfo.flag}" alt="${countryInfo.name}" class="flag-img" style="width: 24px !important; height: 16px !important; display: inline-block !important;">
                        <span>${countryInfo.name}</span>
                    </div>
                ` : ''}
            </div>
            <div class="project-badges">
                <span class="badge" style="text-transform: capitalize;">${category}</span>
                ${verified ? '<span class="badge" style="border-color: var(--secondary); color: var(--secondary);"><i class="bx bx-check-shield"></i> Verified</span>' : ''}
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="project-meta">
                <span>Annual Offset:</span>
                <span class="impact-val">${impact.toLocaleString()} ${unit}</span>
            </div>
        `;
        return card;
    };


    // Fetch Logic integrating REST Countries API + Mock Data
    const fetchProjects = async () => {
        // Prepare UI state
        loadingState.classList.remove('hidden');
        projectsGrid.classList.add('hidden');
        errorState.classList.add('hidden');
        projectsGrid.innerHTML = '';

        try {
            // STEP 1: Fetch Third-Party API Data (REST Countries)
            // Fetching flags and names for the project countries
            const codes = mockDb.map(p => p.country_code).join(',');
            const apiResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`);
            
            if (!apiResponse.ok) throw new Error('Third-party API failed to respond.');
            
            const countriesData = await apiResponse.json();
            
            // Map API response to a lookup object for easy access
            const countryLookup = {};
            countriesData.forEach(c => {
                countryLookup[c.cca2.toLowerCase()] = {
                    name: c.name.common,
                    flag: c.flags.svg || c.flags.png
                };
            });

            // STEP 2: Merge API data with our Mock Database
            allProjects = mockDb.map(project => ({
                ...project,
                countryInfo: countryLookup[project.country_code]
            }));
            
            // Initial Render
            renderProjects(allProjects);
            
            // Setup Filters only if successful
            setupFiltering();
            
        } catch (error) {
            console.error('API Fetch Error:', error);
            // Fallback: Still show projects even if API fails, just without flags
            allProjects = [...mockDb];
            renderProjects(allProjects);
            setupFiltering();
            
            // Optional: Show a subtle warning or just proceed gracefully
            // errorMsg.innerText = "Showing projects with limited data due to API error.";
        } finally {
            loadingState.classList.add('hidden');
        }
    };

    const renderProjects = (projectsArray) => {
        // Remove old DOM content
        projectsGrid.innerHTML = '';

        if (projectsArray.length === 0) {
            projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No projects found matching the criteria.</p>`;
        } else {
            // Functional Array Method: `map` over elements
            const projectNodes = projectsArray.map(proj => buildProjectCard(proj));
            
            // DOM manipulation appending mapped elements 
            projectNodes.forEach(node => projectsGrid.appendChild(node));
        }

        projectsGrid.classList.remove('hidden');
        calculateStats(projectsArray);
    };

    // Advanced Data processing using `.reduce`
    const calculateStats = (filteredList) => {
        // Calculate Total impact of currently displayed items using Array.reduce
        const totalImpact = filteredList.reduce((accumulator, currProj) => {
            return accumulator + currProj.impact;
        }, 0);

        const projectCount = filteredList.length;
        
        // Update DOM
        projectStats.innerText = `Showing ${projectCount} items | Total offset capability: ${totalImpact.toLocaleString()} CO₂e`;
    };

    // Filter Logic using Array `filter` method
    const setupFiltering = () => {
        if (!categoryFilter) return;

        // Ensure single event listener setup via unbind/bind conceptually (or just once in scope)
        categoryFilter.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            
            let filteredProjects;
            
            if (selectedType === 'all') {
                filteredProjects = [...allProjects]; // Object copying technique
            } else {
                // Array Method: `filter`
                filteredProjects = allProjects.filter(project => {
                    // Object structure accessing
                    return project.category === selectedType;
                });
            }

            renderProjects(filteredProjects);
        });
    };

    // Bind retry
    if (retryBtn) {
        retryBtn.addEventListener('click', fetchProjects);
    }

    // Auto-fetch on load
    fetchProjects();

});
