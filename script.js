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

    // Show loading state
    showLoading();
    
    try {
        // Fetch weather data for both cities
        const [departureData, arrivalData] = await Promise.all([
            getWeatherData(departureCity),
            getWeatherData(arrivalCity)
        ]);
        
        // Store data globally
        departureWeatherData = departureData;
        arrivalWeatherData = arrivalData;
        
        // Get forecast data
        const [departureForecast, arrivalForecast] = await Promise.all([
            getForecastData(departureCity),
            getForecastData(arrivalCity)
        ]);
        
        // Display results
        displayWeatherResults(departureData, arrivalData);
        displayFlightStatus(departureData, arrivalData);
        displayForecast(departureForecast);
        
        // Show results
        showResults();
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Unable to fetch weather data. Please check city names and try again.');
    }
}

// Fetch 5-day forecast data
async function getForecastData(cityName) {
    const url = `${CONFIG.WEATHER_API_BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${CONFIG.WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// Display weather results
function displayWeatherResults(departureData, arrivalData) {
    // Update departure weather
    updateWeatherCard('departure', departureData);
    
    // Update arrival weather
    updateWeatherCard('arrival', arrivalData);
}

// Get weather icon from mapping
function getWeatherIcon(iconCode) {
    return CONFIG.WEATHER_ICONS[iconCode] || '🌤️';
}