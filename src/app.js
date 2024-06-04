document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "ad1e4431d83123821ec7a36d38bf8610"; // Replace with your actual API key
    const searchForm = document.getElementById("search-form");
    const cityElement = document.getElementById("city");
    const descriptionElement = document.getElementById("description");
    const humidityElement = document.getElementById("humidity");
    const windSpeedElement = document.getElementById("wind-speed");
    const temperatureElement = document.getElementById("temperature");
    const iconElement = document.getElementById("icon");
    const forecastElement = document.getElementById("forecast");
    const timeElement = document.getElementById("time");

    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const city = document.getElementById("search-form-input").value;
        getWeather(city);
    });

    function formatDate(date) {
        let minutes = date.getMinutes();
        let hours = date.getHours();
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let day = days[date.getDay()];

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        return `${day} ${hours}:${minutes}`;
    }

    function updateWeather(response) {
        const data = response.data;
        const temperature = data.main.temp;
        const date = new Date(data.dt * 1000);

        cityElement.innerHTML = data.name;
        timeElement.innerHTML = formatDate(date);
        descriptionElement.innerHTML = data.weather[0].description;
        humidityElement.innerHTML = `${data.main.humidity}%`;
        windSpeedElement.innerHTML = `${data.wind.speed} km/h`;
        temperatureElement.innerHTML = Math.round(temperature);
        iconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        getForecast(data.coord.lat, data.coord.lon);
    }

    function getWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(updateWeather).catch(error => {
            console.error("Error fetching weather data:", error);
        });
    }

    function updateForecast(response) {
        forecastElement.innerHTML = "";
        const forecastData = response.data.list;

        for (let i = 0; i < forecastData.length; i += 8) { // 3-hourly data, so 8 intervals for daily
            const dayData = forecastData[i];
            const date = new Date(dayData.dt * 1000);
            const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
            const temp = Math.round(dayData.main.temp);
            const description = dayData.weather[0].description;
            const icon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;

            forecastElement.innerHTML += `
                <div class="forecast-day">
                    <span>${dayName}</span>
                    <img src="${icon}" alt="${description}" />
                    <span>${temp}℃</span>
                </div>
            `;
        }
    }

    function getForecast(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(updateForecast).catch(error => {
            console.error("Error fetching forecast data:", error);
        });
    }

    // Fetch default city weather
    getWeather("Polokwane");
});
