const apiKey = '052b1d2091d74ad943a3062c719b9e6a'; // Replace with your OpenWeatherMap API key

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const weatherInfo = document.getElementById('weatherInfo');
    const city = cityInput.value.trim();

    // Add loading state
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

        const html = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p class="temp">${Math.round(data.main.temp)}°C</p>
            <p class="description">${data.weather[0].description}</p>
            <p class="details">
                Humidity: ${data.main.humidity}%<br>
                Wind Speed: ${data.wind.speed} m/s
            </p>
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