let apiKey = 'aa8e6a512b00488f856170300250304';
let cities = ["London", "New York", "Tokyo", "Sydney", "Paris", "Cologne", "Moscow", "Dubai", "Maringá", "Curitiba", "Rome", "Rovaniemi"];

async function getWeather(city = null) {
    try {
        let container = document.getElementById("weather-container");
        if (!container) {
            console.error("Error: Element with ID 'weather-container' not found.");
            return;
        }

        container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading weather data...</div>';

        let cityList = city ? [city] : cities;

        let requests = cityList.map(cityName => 
            fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch ${city}: ${response.statusText}`);
                return response.json();
            })
            .catch(error => {
                console.error(`Error fetching weather data for ${city}:`, error);
                return null;
            })
        );

        let results = await Promise.all(requests);

        container.innerHTML = "";

        results.forEach(data => {
            if (!data || !data.location) {
                console.warn("Skipping invalid data:", data);
                return;
            }

            let weatherCard = document.createElement("a");
            weatherCard.className = "weather-card";
            weatherCard.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(data.location.name)}`;
            weatherCard.target = "_blank";
            weatherCard.style.textDecoration = "none";

            let localTime = data.location.localtime.split(" ")[1];
            weatherCard.innerHTML = `
                <div class="card-content">
                    <h3>${data.location.name}</h3>
                    <p class="country"><i class="fas fa-globe"></i> ${data.location.country}</p>
                    <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
                    <p class="temperature">${data.current.temp_c}°C</p>
                    <p class="condition">${data.current.condition.text}</p>
                    <p class="local-time"><i class="far fa-clock"></i> ${localTime}</p>
                    <div class="more-info"><i class="fas fa-info-circle"></i> Click for more info</div>
                </div>
            `;
            container.appendChild(weatherCard);
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById("weather-container").innerHTML = "<p>Error loading weather data</p>";
    }
}

window.onload = function () {
    getWeather();
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("getWeather").addEventListener("click", function () {
        let cityInput = document.getElementById("city-input").value.trim();
        if (cityInput) {
            getWeather(cityInput);
        } else {
            alert("Please enter a city name.");
        }
    }
    );
});

document.getElementById("change-btn").addEventListener("click", function () {
    let body = document.body;
    body.classList.toggle("dark-mode");

    const icon = this.querySelector("i");

    if (body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        this.innerHTML = '<i class="fas fa-sun me-1"></i> Light Mode';
    }
    else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        this.innerHTML = '<i class="fas fa-moon me-1"></i> Dark Mode';
    }
});
