const apiKey = 'JmowsSKmCiDtgh2R71wC4JcvakXLaSZS';
const weatherResultDiv = document.getElementById('weatherResult');

// Map weather codes to specific icons and descriptions
const weatherData = {
    '1100': { icon: 'images/sun.png', description: 'Clear sky' },          // Clear sky
    '1001': { icon: 'images/clouds.png', description: 'Cloudy' },         // Cloudy
    '1101': { icon: 'images/partly_cloudy.png', description: 'Partly cloudy' }, // Partly cloudy
    '1102': { icon: 'images/overcast.png', description: 'Overcast' },     // Overcast
    '1300': { icon: 'images/rain.png', description: 'Light rain' },       // Light rain
    '1301': { icon: 'images/rain.png', description: 'Rain' },             // Rain
    '1302': { icon: 'images/heavy_rain.png', description: 'Heavy rain' },  // Heavy rain
};

function getWeather() {
    const location = document.getElementById('cityInput').value.trim();

    if (location === '') {
        alert('Please enter a city name.');
        return;
    }

    const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${apiKey}`;

    weatherResultDiv.innerHTML = '<p>Loading...</p>';
    weatherResultDiv.style.display = 'block';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data from Tomorrow.io');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error:', error);
            weatherResultDiv.innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    if (data.timelines) {
        const currentWeather = data.timelines.hourly[0];
        const weatherCondition = currentWeather.values.weatherCode; // e.g., '1100'

        // Get icon URL and description based on the weather condition code
        const weatherInfo = weatherData[weatherCondition] || { icon: 'images/default.png', description: 'Weather condition not available' };

        const weather = `
            <h2>Weather for ${data.location.name}</h2>
            <img class="weather-icon" src="${weatherInfo.icon}" alt="Weather Icon">
            <p><strong>Temperature:</strong> ${currentWeather.values.temperature}°C</p>
            <p><strong>Humidity:</strong> ${currentWeather.values.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${currentWeather.values.windSpeed} m/s</p>
            <p><strong>Condition:</strong> ${weatherInfo.description} (${weatherCondition})</p>
        `;

        weatherResultDiv.innerHTML = weather;
    } else {
        weatherResultDiv.innerHTML = `<p>No weather data available for this location.</p>`;
    }
}
