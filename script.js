const apiKey = '517e63fd53d1b1bec8d5ac83860cd20e'; 
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const todayTab = document.getElementById('todayTab');
const forecastTab = document.getElementById('forecastTab');
const todayContent = document.getElementById('todayContent');
const forecastContent = document.getElementById('forecastContent');

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    return fetch(url).then(response => response.json());
}

function fetchForecastData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    return fetch(url).then(response => response.json());
}

function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('currentWeather');
    currentWeather.innerHTML = `
        <h2>${data.name}</h2>
        <p>Температура: ${data.main.temp}°C</p>
        <p>Відчувається як: ${data.main.fe els_like}°C</p>
        <p>Опис: ${data.weather[0].description}</p>
        <p>Світанок: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Захід сонця: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
}

function switchTab(tab) {
    if (tab === 'today') {
        todayTab.classList.add('active');
        forecastTab.classList.remove('active');
        todayContent.classList.add('active');
        forecastContent.classList.remove('active');
    } else {
        todayTab.classList.remove('active');
        forecastTab.classList.add('active');
        todayContent.classList.remove('active');
        forecastContent.classList.add('active');
    }
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value || 'Ваше місто'; // Вставте логіку для отримання міста за замовчуванням
    fetchWeatherData(city)
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                fetchForecastData(city).then(forecastData => {
                    displayHourlyForecast(forecastData);
                    displayFiveDayForecast(forecastData);
                });
            } else {
                alert('Не вдалося знайти місто. Спробуйте ще раз.');
            }
        });
});

todayTab.addEventListener('click', () => switchTab('today'));
forecastTab.addEventListener('click', () => switchTab('forecast'));

// Додайте логіку для отримання погодинного прогнозу та прогнозу на 5 днів
function displayHourlyForecast(data) {
    const hourlyForecast = document.getElementById('hourlyForecast');
    hourlyForecast.innerHTML = '<h3>Погодинний прогноз</h3>';
    data.list.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString();
        hourlyForecast.innerHTML += `
            <div>
                <p>Час: ${time}</p>
                <p>Температура: ${item.main.temp}°C</p>
                <p>Відчувається як: ${item.main.feels_like}°C</p>
                <p>Опис: ${item.weather[0].description}</p>
                <p>Вітер: ${item.wind.speed} м/с</p>
            </div>
        `;
    });
}

function displayFiveDayForecast(data) {
    const fiveDayForecast = document.getElementById('fiveDayForecast');
    fiveDayForecast.innerHTML = '<h3>Прогноз на 5 днів</h3>';
    data.list.forEach(item => {
        const day = new Date(item.dt * 1000).toLocaleDateString('uk-UA', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
        fiveDayForecast.innerHTML += `
            <div class="forecast-day" onclick="showDailyForecast('${item.dt}')">
                <p>${day}</p>
                <p>Температура: ${item.main.temp}°C</p>
                <p>Опис: ${item.weather[0].description}</p>
            </div>
        `;
    });
}

function showDailyForecast(date) {
    // Логіка для відображення погодинного прогнозу для вибраного дня
}

// Додайте логіку для обробки геолокації
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(`${lat},${lon}`).then(data => {
            displayCurrentWeather(data);
            fetchForecastData(`${lat},${lon}`).then(forecastData => {
                displayHourlyForecast(forecastData);
                displayFiveDayForecast(forecastData);
            });
        });
    });
} else {
    alert('Геолокація не підтримується вашим браузером. Будь ласка, введіть місто вручну.');
}

// Додайте обробку для випадків, коли місто не знайдено
function handleCityNotFound() {
    alert('Не вдалося знайти інформацію про введене місто. Перевірте правильність написання.');
}

// Додайте логіку для обробки помилок API
fetchWeatherData(city)
    .then(data => {
        if (data.cod === 200) {
            displayCurrentWeather(data);
            fetchForecastData(city).then(forecastData => {
                displayHourlyForecast(forecastData);
                displayFiveDayForecast(forecastData);
            });
        } else {
            handleCityNotFound();
        }
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        handleCityNotFound();
    });