// ===============================
// DOM Elements
// ===============================
const placeInput = document.querySelector("#placeInput");
const submitBtn = document.querySelector("#submitBtn");
const dayTimeEl = document.getElementById("dayTime");
const dateNowEl = document.getElementById("dateNow");
const timeEl = document.getElementById("time");
const tempEl = document.getElementById("temp");
const weatherCodeEl = document.getElementById("weatherCode");
const weekEl = document.getElementById("week");

// ===============================
// Helpers
// ===============================
function formatTime(hours, minutes) {
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hour12}:${paddedMinutes} ${ampm}`;
}

function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
}

function getWeatherDescription(code) {
    const weatherCodeMap = {
        0: "Clear",
        1: "Clear",
        2: "Partly cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Rime fog",
        51: "Drizzle",
        53: "Drizzle",
        55: "Drizzle",
        61: "Rain",
        63: "Rain",
        65: "Heavy rain",
        71: "Snow",
        73: "Snow",
        75: "Snow",
        80: "Showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm",
    };

    return weatherCodeMap[code] || "Unknown";
}

function getWeekDaysFromDates(dates) {
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dates.map((dateStr, i) => {
        const d = new Date(dateStr);
        return i === 0 ? "Today" : shortDays[d.getDay()];
    });
}

// ===============================
// API Calls
// ===============================
async function geoCoding(place) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=5&language=en&format=json&countryCode=PH`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        return (data.results || []).map(
            ({
                name,
                latitude,
                longitude,
                admin1,
                admin2,
                admin3,
                country,
                feature_code,
            }) => ({
                name,
                latitude,
                longitude,
                admin1,
                admin2,
                admin3,
                country,
                feature_code,
            })
        );

    } catch (error) {
        console.error("Geocoding error:", error);
        return [];
    }
}

async function getWeather(latitude = 52.52, longitude = 13.41) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code&hourly=temperature_2m&current=temperature_2m,weather_code,is_day&timezone=Asia%2FSingapore`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        return {
            latitude,
            longitude,
            temperatureUnit: data.current_units.temperature_2m,
            currentTemp: data.current.temperature_2m,
            currentCode: data.current.weather_code,
            currentIsDay: data.current.is_day,
            dailyTime: data.daily.time,
            dailyTemperature: data.daily.temperature_2m_max,
            dailyWeatherCode: data.daily.weather_code,
        };
    } catch (error) {
        console.error("Weather fetch error:", error);
        return null;
    }
}

// ===============================
// UI Updates
// ===============================
function updateTime() {
    const now = new Date();
    dateNowEl.textContent = now.toDateString();
    timeEl.textContent = formatTime(now.getHours(), now.getMinutes());
    dayTimeEl.textContent = getGreeting(now.getHours());
}

function displayWeekTemp(dailyTimes, dailyTemp, dailyCode) {
    if (!dailyTimes) return;

    const days = getWeekDaysFromDates(dailyTimes);
    const weeks = Array.from(weekEl.children);

    weeks.forEach((week, i) => {
        const divDay = document.createElement("div");
        const divDailyTemp = document.createElement("div");
        const divDailyCode = document.createElement("div");

        divDay.textContent = days[i] || "";
        divDay.classList.add("day");

        divDailyTemp.textContent = `${dailyTemp[i]}°`;
        divDailyTemp.classList.add("dailyTemp");

        divDailyCode.textContent = getWeatherDescription(dailyCode[i]);
        divDailyCode.classList.add("code");

        console.log(divDailyCode.textContent);

        week.innerHTML = "";
        week.appendChild(divDay);
        week.appendChild(divDailyTemp);
        week.appendChild(divDailyCode);
    });
}
//°`

async function updateWeather(latitude, longitude) {
    const weather = await getWeather(latitude, longitude);

    if (weather) {
        tempEl.textContent = `${weather.currentTemp}°`;
        weatherCodeEl.textContent = getWeatherDescription(weather.currentCode);
        displayWeekTemp(
            weather.dailyTime,
            weather.dailyTemperature,
            weather.dailyWeatherCode
        );
    } else {
        tempEl.textContent = "-- °";
        weatherCodeEl.textContent = "--";
    }
}

async function displayTemp(place) {
    const results = await geoCoding(place);
    const result = results.at(-1)
    const {latitude, longitude} = result;

    updateWeather(latitude, longitude)
}

// ===============================
// Initialization
// ===============================
async function init() {
    updateTime();
    setInterval(updateTime, 30 * 1000);

    tempEl.textContent = "...";
    weatherCodeEl.textContent = "...";

    await updateWeather(); // Default: Berlin
}

// ===============================
// Events
// ===============================
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const place = placeInput.value.trim();
    if (place) displayTemp(place);
});


document.addEventListener("DOMContentLoaded", init);
