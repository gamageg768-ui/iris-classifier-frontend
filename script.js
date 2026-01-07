// Iris Classifier Frontend JavaScript
// ====================================

// CONFIGURATION - UPDATE THIS AFTER DEPLOYING TO HUGGING FACE!
const API_URL = "https://gamageg-iris-classifier.hf.space/predict";


// Sample data for quick testing
const SAMPLES = {
    setosa: {
        sepal_length: 5.1,
        sepal_width: 3.5,
        petal_length: 1.4,
        petal_width: 0.2
    },
    versicolor: {
        sepal_length: 5.9,
        sepal_width: 3.0,
        petal_length: 4.2,
        petal_width: 1.5
    },
    virginica: {
        sepal_length: 6.5,
        sepal_width: 3.0,
        petal_length: 5.8,
        petal_width: 2.2
    }
};

// Species information
const SPECIES_INFO = {
    setosa: {
        title: 'Iris Setosa',
        description: 'Characterized by smaller flowers with shorter petals. Typically found in Arctic regions of Alaska, Maine, and the Canadian provinces. This is the most easily distinguished species of Iris.',
        emoji: '🌸'
    },
    versicolor: {
        title: 'Iris Versicolor',
        description: 'Medium-sized flowers commonly found in Eastern North America. Also known as "Blue Flag", it thrives in wetlands and along stream banks. The state flower of Tennessee.',
        emoji: '💜'
    },
    virginica: {
        title: 'Iris Virginica',
        description: 'Larger flowers with longer petals, found primarily in the Eastern United States. Also called "Southern Blue Flag", it prefers wetter habitats and can tolerate partial shade.',
        emoji: '🌺'
    }
};

// Get DOM elements
const form = document.getElementById('classifierForm');
const classifyBtn = document.getElementById('classifyBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await classifyFlower();
});

// Main classification function
async function classifyFlower() {
    // Hide previous results/errors
    hideElement(resultsSection);
    hideElement(errorMessage);
    
    // Show loading indicator
    showElement(loadingIndicator);
    disableButton(classifyBtn);
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        sepal_length: parseFloat(formData.get('sepal_length')),
        sepal_width: parseFloat(formData.get('sepal_width')),
        petal_length: parseFloat(formData.get('petal_length')),
        petal_width: parseFloat(formData.get('petal_width'))
    };
    
    try {
        // Make API request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Display results
        displayResults(result);
        
    } catch (error) {
        // Display error
        displayError(error);
    } finally {
        // Hide loading, enable button
        hideElement(loadingIndicator);
        enableButton(classifyBtn);
    }
}

// Display prediction results
function displayResults(result) {
    // Update species name
    document.getElementById('resultSpecies').textContent = 
        SPECIES_INFO[result.prediction].emoji + ' ' + result.prediction.toUpperCase();
    
    // Update confidence
    document.getElementById('resultConfidence').textContent = 
        `${result.confidence}% Confidence`;
    
    // Update probability bars
    const probabilitiesHtml = Object.entries(result.probabilities)
        .map(([species, probability]) => `
            <div class="probability-item">
                <div class="probability-label">
                    <span>${species.charAt(0).toUpperCase() + species.slice(1)}</span>
                    <span>${probability}%</span>
                </div>
                <div class="probability-bar">
                    <div class="probability-fill" style="width: ${probability}%">
                        ${probability > 10 ? probability + '%' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    
    document.getElementById('probabilities').innerHTML = probabilitiesHtml;
    
    // Update metadata
    const metaHtml = `
        <div class="meta-item">
            <div class="meta-label">Latency</div>
            <div class="meta-value">${result.latency_ms}ms</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Model Version</div>
            <div class="meta-value">${result.model_version}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Timestamp</div>
            <div class="meta-value">${new Date(result.timestamp).toLocaleTimeString()}</div>
        </div>
    `;
    
    document.getElementById('resultMeta').innerHTML = metaHtml;
    
    // Update species information
    const speciesData = SPECIES_INFO[result.prediction];
    const speciesInfoHtml = `
        <h3>${speciesData.emoji} ${speciesData.title}</h3>
        <p>${speciesData.description}</p>
    `;
    
    document.getElementById('speciesInfo').innerHTML = speciesInfoHtml;
    
    // Show results section
    showElement(resultsSection);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display error message
function displayError(error) {
    const errorHtml = `
        <h3>Classification Failed</h3>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Troubleshooting:</strong></p>
        <ul>
            <li>Check your internet connection</li>
            <li>Verify the API URL is correct in <code>script.js</code></li>
            <li>Make sure the Hugging Face backend is deployed and running</li>
            <li>Try again in a few moments</li>
        </ul>
    `;
    
    document.getElementById('errorContent').innerHTML = errorHtml;
    showElement(errorMessage);
    
    // Scroll to error
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Load sample data into form
function loadSample(species) {
    const sample = SAMPLES[species];
    
    document.getElementById('sepalLength').value = sample.sepal_length;
    document.getElementById('sepalWidth').value = sample.sepal_width;
    document.getElementById('petalLength').value = sample.petal_length;
    document.getElementById('petalWidth').value = sample.petal_width;
    
    // Add visual feedback
    form.classList.add('sample-loaded');
    setTimeout(() => form.classList.remove('sample-loaded'), 300);
}

// Utility functions
function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}

function disableButton(button) {
    button.disabled = true;
    button.textContent = '⏳ Analyzing...';
}

function enableButton(button) {
    button.disabled = false;
    button.textContent = '🔍 Classify Flower';
}

// Check API availability on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(API_URL.replace('/predict', '/health'));
        if (response.ok) {
            console.log('✅ API is reachable');
        }
    } catch (error) {
        console.warn('⚠️ API is not reachable. Update API_URL in script.js');
        console.warn('Current API_URL:', API_URL);
    }
});

// Add sample-loaded animation
const style = document.createElement('style');
style.textContent = `
    @keyframes samplePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    .sample-loaded {
        animation: samplePulse 0.3s ease-out;
    }
`;
document.head.appendChild(style);
