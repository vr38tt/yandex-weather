// API-ключ
const API_KEY = '2ff600f8-2021-4646-a87f-5885f2bd0cc2';


const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherInfoDiv = document.getElementById('weather-info');


async function getCoordinates(city) {
    try {

        const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            return {
                lat: data[0].lat,
                lon: data[0].lon
            };
        } else {
            throw new Error('Город не найден');
        }
    } catch (error) {
        throw new Error(`Ошибка при поиске города: ${error.message}`);
    }
}


async function getWeatherData(lat, lon) {
    try {

        const url = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`;


        const response = await fetch(url, {
            headers: {
                'X-Yandex-Weather-Key': API_KEY
            }
        });
        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.message || 'Ошибка при получении данных о погоде');
        }

        return data;
    } catch (error) {
        throw new Error(`Ошибка при получении данных о погоде: ${error.message}`);
    }
}


function displayWeather(data, city) {

    const fact = data.fact;


    if (!fact) {
        displayError('Не удалось получить текущие данные о погоде.');
        return;
    }


    const html = `
        <h2>${city}</h2>
        <p>Температура: ${fact.temp}°C</p>
        <p>Ощущается как: ${fact.feels_like}°C</p>
        <p>Состояние: ${fact.condition}</p>
        <p>Ветер: ${fact.wind_speed} м/с, направление ${getWindDirection(fact.wind_dir)}</p>
    `;


    weatherInfoDiv.innerHTML = html;
}


function getWindDirection(dir) {
    const directions = {
        'nw': 'северо-западный', 'n': 'северный', 'ne': 'северо-восточный',
        'e': 'восточный', 'se': 'юго-восточный', 's': 'южный',
        'sw': 'юго-западный', 'w': 'западный', 'c': 'штиль'
    };
    return directions[dir] || dir;
}

function getWindDirection(dir) {
    const directions = {
        'nw': 'северо-западный', 'n': 'северный', 'ne': 'северо-восточный',
        'e': 'восточный', 'se': 'юго-восточный', 's': 'южный',
        'sw': 'юго-западный', 'w': 'западный', 'c': 'штиль'
    };
    return directions[dir] || dir;
}

function displayError(message) {
    weatherInfoDiv.innerHTML = `<p class="error-message">${message}</p>`;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    weatherInfoDiv.innerHTML = '';

    if (city === '') {
        displayError('Пожалуйста, введите название города');
        return;
    }

    try {
        const coords = await getCoordinates(city);

        const weatherData = await getWeatherData(coords.lat, coords.lon);

        displayWeather(weatherData, city);

    } catch (error) {
        displayError(error.message);
    }
});