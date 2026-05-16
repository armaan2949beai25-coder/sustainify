document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('footprintForm');
    const resultContent = document.getElementById('resultContent');
    const noDataResult = document.getElementById('noDataResult');
    const btnText = document.getElementById('btnText');
    const calcLoader = document.getElementById('calcLoader');
    const clearBtn = document.getElementById('clearStateBtn');
    
    // Outputs
    const totalOutput = document.getElementById('totalOutput');
    const outTransport = document.getElementById('outTransport');
    const outEnergy = document.getElementById('outEnergy');
    const outDiet = document.getElementById('outDiet');
    const outLifestyle = document.getElementById('outLifestyle');
    const outWaste = document.getElementById('outWaste');
    const outDigital = document.getElementById('outDigital');
    const suggestionList = document.getElementById('suggestionList');

    const calcBg = document.getElementById('calcBg');
    
    // Background images setup
    const bgs = [
        'url("images/bg/bg1.png")',
        'url("images/bg/bg2.jpeg")',
        'url("images/bg/bg3.jpeg")',
        'url("images/bg/bg4.jpg")',
        'url("images/bg/bg5.jpg")',
        'url("images/bg/bg_transport.png")'
    ];
    
    // Map steps to an index to cycle backgrounds
    const stepIndices = {
        'stepGeneralGroup': 0,
        'stepTransportGroup': 5,
        'stepHomeGroup': 2,
        'stepFoodGroup': 3,
        'stepLifestyleGroup': 4,
        'stepWasteWaterGroup': 0, // recycle backgrounds beyond 5
        'stepWorkDigitalGroup': 1,
        'stepGreenGroup': 2,
        'stepResultsGroup': 4
    };

    const loadState = () => {
        const savedData = localStorage.getItem('ecoTrackDataV2');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                document.querySelectorAll('.step-container').forEach(el => el.classList.add('hidden'));
                form.classList.add('hidden');
                document.getElementById('stepResultsGroup').classList.remove('hidden');
                changeBackground('stepResultsGroup');
                displayResults(parsed);
            } catch (error) {
                console.error("Error parsing JSON state", error);
            }
        } else {
            changeBackground('stepGeneralGroup'); // init
        }
    };
    
    const changeBackground = (stepId) => {
        if (!calcBg) return;
        const index = stepIndices[stepId] || 0;
        calcBg.style.backgroundImage = bgs[index];
    };

    // Generic Validation
    const validateStep = (stepGroup) => {
        const inputs = stepGroup.querySelectorAll('input, select');
        let valid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                valid = false;
            }
        });
        return valid;
    };

    // Generic Routing via data attributes
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextId = btn.getAttribute('data-next');
            const prevId = btn.getAttribute('data-prev');
            const currentStep = btn.closest('.step-container');

            if (nextId) {
                if(!validateStep(currentStep)) return;
                currentStep.classList.add('hidden');
                document.getElementById(nextId).classList.remove('hidden');
                changeBackground(nextId);
            } else if (prevId) {
                currentStep.classList.add('hidden');
                document.getElementById(prevId).classList.remove('hidden');
                changeBackground(prevId);
            }
        });
    });

    const calculateEmissions = (userData) => {
        const householdSize = userData.householdSize || 1;
        let transEmissions = 0, energyEmissions = 0, dietEmissions = 0, lifestyleEmissions = 0, wasteEmissions = 0, digitalEmissions = 0;
        let suggestions = [];

        // 1. Transport
        const d = userData.distanceQty;
        const modeFactor = { 'car-petrol': 0.25, 'car-diesel': 0.28, 'ev': 0.05, 'public': 0.08, 'bike': 0 };
        transEmissions += (d * 365) * (modeFactor[userData.transportMode] || 0);
        if (userData.transportMode && userData.transportMode.includes('car')) {
            suggestions.push("Consider carpooling or switching to public transit to slash commute emissions.");
        }
        transEmissions += (userData.flightsShort * 250);
        transEmissions += (userData.flightsLong * 1000);
        
        // 2. Energy
        const gridFactor = { 'non-renewable': 1.0, 'mixed': 0.6, 'renewable': 0.1 };
        const heatingFactor = userData.acHeaterUse * 30 * 12 * 0.5; // roughly 0.5kg per hour
        let baseHomeEmissions = (userData.energyUsage * 12 * 0.4) * (gridFactor[userData.energyType] || 0.6);
        baseHomeEmissions += heatingFactor;
        
        if (userData.cookingFuel === 'lpg') baseHomeEmissions += 200;
        else if (userData.cookingFuel === 'biomass') baseHomeEmissions += 400;

        energyEmissions = baseHomeEmissions / householdSize;
        if (userData.energyType === 'non-renewable') suggestions.push("Switching to a green energy tariff can drastically cut your household footprint.");

        // 3. Diet
        const dietFactor = { 'non-veg-heavy': 1500, 'non-veg-light': 1000, 'vegetarian': 600, 'vegan': 300 };
        dietEmissions += dietFactor[userData.dietType] || 1000;
        if (userData.dairyConsumption === 'high') dietEmissions += 300;
        dietEmissions += (userData.eatingOut * 52 * 2); // 2kg per outing
        if (userData.dietType && userData.dietType.includes('non-veg')) {
            suggestions.push("Going meatless just one or two days a week reduces dietary emissions heavily.");
        }

        // 4. Lifestyle
        if (userData.clothingHabits === 'frequent') lifestyleEmissions += 400;
        else if (userData.clothingHabits === 'average') lifestyleEmissions += 150;
        
        lifestyleEmissions += (userData.onlineOrders * 12 * 5); // 5kg per package
        if (userData.expressDelivery === 'always') lifestyleEmissions += 150;
        
        if (userData.gadgetFreq === 'high') lifestyleEmissions += 500;
        else if (userData.gadgetFreq === 'medium') lifestyleEmissions += 200;
        
        if (userData.clothingHabits === 'frequent') suggestions.push("Fast fashion has a massive water and carbon footprint. Buy second-hand or invest in durable garments.");

        // 5. Waste & Water
        if (userData.recyclingHabit === 'never') wasteEmissions += 300;
        else if (userData.recyclingHabit === 'sometimes') wasteEmissions += 150;
        
        if (userData.composting === 'no') wasteEmissions += 100;
        
        wasteEmissions += (userData.waterUsage * 365 * 0.001); // 1 liter = 0.001 kg roughly
        if (userData.waterAppliances === 'no') wasteEmissions += 50;

        if (userData.recyclingHabit === 'never') suggestions.push("Start simple recycling (paper/cardboard) to reduce landfill methane emissions.");

        // 6. Digital & Work
        if (userData.workMode === 'offline') digitalEmissions += 0; // Commute already handled
        else if (userData.workMode === 'online') digitalEmissions += 150; // Extra home energy
        
        digitalEmissions += (userData.laptopHours * 365 * 0.05); // laptop manufacture and run
        let streamFactor = { 'sd': 0.05, 'hd': 0.1, '4k': 0.3 };
        digitalEmissions += (userData.streamingHours * 365 * (streamFactor[userData.videoQuality] || 0.1));

        if (userData.videoQuality === '4k') suggestions.push("Downgrading streams from 4K to HD can save massive amounts of data center energy.");

        // 7. Green Practices (Reductions)
        let total = transEmissions + energyEmissions + dietEmissions + lifestyleEmissions + wasteEmissions + digitalEmissions;
        
        if (userData.reusableBags === 'yes') total -= 50;
        if (userData.plantTrees === 'yes') total -= 200;
        if (userData.solarPanels === 'yes') total -= 600;
        if (userData.rainwater === 'yes') total -= 50;

        if (total < 0) total = 0; // Just in case

        // Guarantee at least some suggestions
        if (suggestions.length === 0) {
            suggestions.push("Switch all your house bulbs to LED.");
            suggestions.push("Check out our Offset Projects to reach Net Zero.");
        }

        return {
            total: total.toFixed(1),
            breakdown: {
                transport: transEmissions.toFixed(1),
                energy: energyEmissions.toFixed(1),
                diet: dietEmissions.toFixed(1),
                lifestyle: lifestyleEmissions.toFixed(1),
                waste: wasteEmissions.toFixed(1),
                digital: digitalEmissions.toFixed(1)
            },
            suggestions: suggestions.slice(0, 4), // max 4 suggestions
            timestamp: new Date().toISOString()
        };
    };

    const displayResults = (resultData) => {
        const { total, breakdown, suggestions } = resultData;
        
        totalOutput.innerText = total;
        outTransport.innerText = `${breakdown.transport} kg`;
        outEnergy.innerText = `${breakdown.energy} kg`;
        outDiet.innerText = `${breakdown.diet} kg`;
        
        if(outLifestyle) outLifestyle.innerText = `${breakdown.lifestyle} kg`;
        if(outWaste) outWaste.innerText = `${breakdown.waste} kg`;
        if(outDigital) outDigital.innerText = `${breakdown.digital} kg`;

        // Render suggestions
        if (suggestionList) {
            suggestionList.innerHTML = '';
            suggestions.forEach(s => {
                const li = document.createElement('li');
                li.innerHTML = `<i class='bx bx-check-circle' style='color: var(--secondary); margin-right: 8px;'></i> ${s}`;
                suggestionList.appendChild(li);
            });
        }

        noDataResult.classList.add('hidden');
        resultContent.classList.remove('hidden');
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form validation fallback
            if (!validateStep(document.getElementById('stepGreenGroup'))) return;

            // Gather all inputs safely
            const val = (id) => document.getElementById(id) ? document.getElementById(id).value : '';
            const valNum = (id) => document.getElementById(id) ? parseFloat(document.getElementById(id).value) || 0 : 0;

            const formData = {
                // Gen
                householdSize: valNum('householdSize') || 1,
                
                // Transport
                transportMode: val('transportMode'),
                distanceQty: valNum('distanceQty'),
                flightsShort: valNum('flightsShort'),
                flightsLong: valNum('flightsLong'),
                
                // Energy
                energyUsage: valNum('energyUsage'),
                energyType: val('energyType'),
                cookingFuel: val('cookingFuel'),
                acHeaterUse: valNum('acHeaterUse'),
                
                // Diet
                dietType: val('dietType'),
                dairyConsumption: val('dairyConsumption'),
                eatingOut: valNum('eatingOut'),
                
                // Lifestyle
                clothingHabits: val('clothingHabits'),
                onlineOrders: valNum('onlineOrders'),
                expressDelivery: val('expressDelivery'),
                gadgetFreq: val('gadgetFreq'),
                
                // Waste
                recyclingHabit: val('recyclingHabit'),
                composting: val('composting'),
                waterUsage: valNum('waterUsage'),
                waterAppliances: val('waterAppliances'),
                
                // Digital
                workMode: val('workMode'),
                laptopHours: valNum('laptopHours'),
                streamingHours: valNum('streamingHours'),
                videoQuality: val('videoQuality'),
                
                // Green
                reusableBags: val('reusableBags'),
                plantTrees: val('plantTrees'),
                solarPanels: val('solarPanels'),
                rainwater: val('rainwater')
            };

            if(btnText) btnText.innerText = "Processing...";
            if(calcLoader) calcLoader.classList.remove('hidden');

            setTimeout(() => {
                const computedResults = calculateEmissions(formData);
                localStorage.setItem('ecoTrackDataV2', JSON.stringify(computedResults));
                
                form.classList.add('hidden');
                document.querySelectorAll('.step-container').forEach(el => el.classList.add('hidden'));
                document.getElementById('stepResultsGroup').classList.remove('hidden');
                changeBackground('stepResultsGroup');
                
                displayResults(computedResults);
                form.reset();

                if(btnText) btnText.innerText = "Calculate Score";
                if(calcLoader) calcLoader.classList.add('hidden');
            }, 1000);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('ecoTrackDataV2');
            
            document.getElementById('stepResultsGroup').classList.add('hidden');
            form.classList.remove('hidden');
            document.getElementById('stepGeneralGroup').classList.remove('hidden');
            changeBackground('stepGeneralGroup');
            
            resultContent.classList.add('hidden');
            form.reset();
        });
    }

    // Trigger mount operations
    loadState();
});
