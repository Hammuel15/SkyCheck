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
