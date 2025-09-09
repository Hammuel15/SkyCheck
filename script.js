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

function displayForecast(forecastData) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = ''; // clear old forecast

    // OpenWeather returns 3-hour steps, so we pick 1 forecast per day
    const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    daily.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = getWeatherIcon(day.weather[0].icon);
        const temp = `${Math.round(day.main.temp)}°C`;
        const desc = day.weather[0].description;

        const card = `
            <div class="forecast-day">
                <div class="forecast-date">${date}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${temp}</div>
                <div class="forecast-desc">${desc}</div>
            </div>
        `;
        forecastGrid.insertAdjacentHTML('beforeend', card);
    });
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




// Show loading state
function showLoading() {
    loadingSection.classList.remove('hidden');
    errorSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
}

// Show error state
function showError(message) {
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.remove('hidden');
    document.getElementById('errorText').textContent = message;
}

// Hide error section
function hideError() {
    errorSection.classList.add('hidden');
}

// Show results
function showResults() {
    loadingSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}