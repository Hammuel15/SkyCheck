// Global variables
let departureWeatherData = null;
let arrivalWeatherData = null;

// DOM Elements
const searchForm = document.getElementById('searchForm');
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const resultsSection = document.getElementById('resultsSection');

function setupEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
}

// Handle search form submission
async function handleSearch(event) {
    event.preventDefault();
    
    const departureCity = document.getElementById('departure').value.trim();
    const arrivalCity = document.getElementById('arrival').value.trim();

    if (!departureCity || !arrivalCity) {
        showError('Please enter both departure and arrival cities.');
        return;
    }
    
    if (departureCity.toLowerCase() === arrivalCity.toLowerCase()) {
        showError('Departure and arrival cities must be different.');
        return;
    }
    
}