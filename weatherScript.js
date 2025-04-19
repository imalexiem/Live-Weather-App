const apiKey = '052b1d2091d74ad943a3062c719b9e6a'; // Replace with your OpenWeatherMap API key

const weatherIcons = {
    'Clear': 'weather/clear.svg',
    'Clouds': 'weather/clouds.svg',
    'Rain': 'weather/rain.svg',
    'Drizzle': 'weather/drizzle.svg',
    'Thunderstorm': 'weather/thunderstorm.svg',
    'Snow': 'weather/snow.svg',
    'Mist': 'weather/atmosphere.svg',
};

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const weatherInfo = document.getElementById('weatherInfo');
    const city = cityInput.value.trim();

    // Show loading
    weatherInfo.style.display = 'block';
    weatherInfo.innerHTML = '<p>Loading...</p>';

    try {
        // First, get coordinates using geocoding API
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
        console.log('Geocoding URL:', geoUrl); // Debug log

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        console.log('Geocoding response:', geoData); // Debug log
        
        if (!geoData || geoData.length === 0) {
            weatherInfo.innerHTML = `<p>City "${city}" not found. Please check the spelling and try again.</p>`;
            return;
        }

        const { lat, lon, name: cityName } = geoData[0];
        console.log(`Coordinates found: lat=${lat}, lon=${lon}`); // Debug log

        // Then fetch weather using coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) {
            throw new Error(`HTTP error! status: ${weatherResponse.status}`);
        }
        
        const data = await weatherResponse.json();
        console.log('Weather data:', data);

        const weatherMain = data.weather[0].main;
        const iconPath = weatherIcons[weatherMain] || 'weather/clouds.svg'; // Default to clouds if condition not found

        const html = `
            <div class="weather-display">
                <div class="weather-header">
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <div class="weather-icon">
                        <img src="${iconPath}" alt="${weatherMain} weather">
                    </div>
                </div>
                <div class="temperature">
                    ${Math.round(data.main.temp)}°C
                </div>
                <div class="weather-details">
                    <div class="detail-item">
                        <span class="label">weather</span>
                        <span class="value">${data.weather[0].description}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">humidity</span>
                        <span class="value">${data.main.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">windspeed</span>
                        <span class="value">${data.wind.speed} m/s</span>
                    </div>
                </div>
            </div>
        `;

        weatherInfo.innerHTML = html;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        weatherInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}