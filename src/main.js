import "./style.css"
import { Weather } from "./models/Weather.js"
import { getWeather } from "./services/WeatherService"
import {
	saveWeather,
	getWeatherHistory,
	getCurrentCity,
	setCurrentCity,
} from "./utils/WeatherStorage"

import wind from "/icons/wind.png"
import heat from "/icons/heat.png"
import humidity from "/icons/humidity.png"
import timezone from "/icons/timezone.png"
import time from "/icons/time.png"
import temperature from "/icons/temperature.png"

/* -------------------------
	STATE
------------------------- */
let weatherHistory = getWeatherHistory().map((w) => new Weather(w)) // Wrap stored objects
let currentWeather = null

/* -------------------------
	DOM ELEMENTS
------------------------- */
const select = document.getElementById("searched_locations")
const searchCity = document.getElementById("search-city")
const errorEl = document.getElementById("error")
const description = document.getElementById("description")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toast-message")
const useLocationBtn = document.getElementById("use-location")
const weatherIcon = document.getElementById("weather-icon")
const toggleTemps = document.getElementById("toggle-temps")
const box = document.getElementById("box")
const loc = document.getElementById("loc")
const forecast = document.getElementById("forecast")

/* -------------------------
	INITIALIZATION
------------------------- */
const lastCity =
	getCurrentCity() || (weatherHistory.length ? weatherHistory[0].city : null)

populateLocationSelect(weatherHistory, lastCity)
if (weatherHistory.length > 0) select.classList.remove("hidden")

if (lastCity) {
	const lastWeather = weatherHistory.find(
		(w) => w.city.toLowerCase() === lastCity.toLowerCase()
	)
	if (lastWeather) renderWeather(lastWeather)
}

window.addEventListener("DOMContentLoaded", () => {
	if (!lastCity) displayWeatherFromLocation()
})

/* -------------------------
	EVENT LISTENERS
------------------------- */
toggleTemps.addEventListener("click", (e) => {
	e.preventDefault()
	toggleTemps.textContent = currentWeather.unit === "C" ? "°F" : "°C"
	toggleTemps.classList.toggle("bg-yellow-400")
	toggleTemps.classList.toggle("bg-gray-800")
	if (!currentWeather) return
	currentWeather.toggleUnit()
	renderWeather(currentWeather)
})

searchCity.addEventListener("click", (e) => {
	e.preventDefault()
	displayWeather()
})

select.addEventListener("change", (e) => {
	const city = e.target.value
	const weather = weatherHistory.find(
		(w) => w.city.toLowerCase() === city.toLowerCase()
	)
	if (!weather) return

	renderWeather(weather)
	setCurrentCity(city)
	populateLocationSelect(weatherHistory, city)
})

if (useLocationBtn)
	useLocationBtn.addEventListener("click", displayWeatherFromLocation)

/* -------------------------
	MAIN FUNCTIONS
------------------------- */
async function displayWeather(cityFromSelect) {
	const cityInput = document.getElementById("weather-city")
	const city = cityFromSelect || cityInput.value.trim()

	errorEl.classList.add("hidden")
	errorEl.textContent = ""

	if (!city) {
		showToast("Please enter a city name", "error")
		return
	}

	// CASE 1: From select
	if (cityFromSelect) {
		const cachedWeather = weatherHistory.find(
			(w) => w.city.toLowerCase() === city.toLowerCase()
		)
		if (!cachedWeather) {
			showToast("City not found in history", "error")
			return
		}

		showToast("Weather updated successfully", "success")
		renderWeather(cachedWeather)
		setCurrentCity(city)
		return
	}

	// CASE 2: From API
	try {
		const response = await getWeather(city)
		if (!response.success) {
			showToast(response.error, "error")
			return
		}

		const weather = new Weather(response.data)
		showToast("Weather updated successfully", "success")

		saveWeather(weather)
		setCurrentCity(city)
		syncWeatherHistory()

		renderWeather(weather)
	} catch (err) {
		showToast("Something went wrong. Please try again.", "error")
		console.error(err)
	}
}

async function displayWeatherFromLocation() {
	if (!navigator.geolocation) {
		showToast("Geolocation is not supported by your browser", "error")
		return
	}

	navigator.geolocation.getCurrentPosition(
		async (position) => {
			const { latitude, longitude } = position.coords
			try {
				const response = await getWeather(`${latitude},${longitude}`)
				if (!response.success) {
					showToast(response.error, "error")
					return
				}

				const weather = new Weather(response.data)
				showToast("Weather updated successfully", "success")

				saveWeather(weather)
				setCurrentCity(weather.city)
				syncWeatherHistory()
				renderWeather(weather)
			} catch (err) {
				showToast("Unable to fetch weather for your location", "error")
				console.error(err)
			}
		},
		(error) => {
			showToast("Location access denied", "error")
			console.warn(error)
		}
	)
}

/* -------------------------
	HELPER FUNCTIONS
------------------------- */
function renderWeather(weather) {
	currentWeather = weather
	weatherIcon.src = weather.getIconUrl()
	loc.innerHTML = `
	<span class="loc-box">
	<p class="flex">${weather.getC()}</p>
	<p class="hidden lg:block ml-5 text-lg font-normal"> Feels like: ${weather.getFeelsLike()} </p> </span>
	`
	box.innerHTML = `
		<span class="inline-flex items-center space-x-2 mt-3">
		<img src=${heat} class="size-6" alt="Heat Index" title="Heat Index">
		<p>${weather.getHeatIndex()}</p>
		</span>
		<span class="inline-flex items-center space-x-2">
		<img src=${humidity} class="size-6" alt="Humidity" title="Humidity">
		<p>${weather.humidity}</p>
		</span>
		<span class="inline-flex items-center space-x-2">
		<img src=${wind} class="size-6" alt="Wind" title="Wind">
		<p>${weather.wind}</p>
		</span>
		<span class="inline-flex items-center space-x-2">
		<img src=${time} class="size-6" alt="Updated" title="Updated">
		<p>${weather.getFormattedUTime()}</p>
		</span>
		<span class="inline-flex items-center space-x-2">
		<img src=${timezone} class="size-6" alt="Timezone" title="Timezone">
		<p>${weather.tz}</p>
		</span>		
	`

	description.innerHTML = `
		<p>${weather.status}</p>
	`

	forecast.innerHTML = weather.forecast
		.map((day) => {
			const min = weather.unit === "C" ? day.minTempC : day.minTempF
			const max = weather.unit === "C" ? day.maxTempC : day.maxTempF

			return `
			<article class="h-60 md:w-1/5 lg:w-1/6 space-x-5 border text-center flex flex-col items-center justify-center gap-2 rounded-lg shadow-sm bg-gray-200">
				<p class="font-semibold">${day.date}</p>
				<img src="https:${day.icon}" alt="${day.condition}" class="w-12 h-12" />
				<p>${day.condition}</p>
				<div class="flex items-center space-x-4">
				<img src=${temperature} class="size-8">
				<p class="font-medium">
					${Math.round(max)}° / ${Math.round(min)}°
				</p>
				<p> </p>
			</article>
		`
		})
		.join("")

	checkWeatherAlerts(weather)
}

function populateLocationSelect(history, selectedCity = null) {
	select.innerHTML = ""

	const defaultOption = document.createElement("option")
	defaultOption.textContent = "Select a city"
	defaultOption.disabled = true
	defaultOption.selected = !selectedCity
	select.appendChild(defaultOption)

	history.forEach((item) => {
		const option = document.createElement("option")
		option.value = item.city
		option.textContent = `${item.city}, ${item.country}`
		if (
			selectedCity &&
			item.city.toLowerCase() === selectedCity.toLowerCase()
		) {
			option.selected = true
		}
		select.appendChild(option)
	})
}

function syncWeatherHistory() {
	weatherHistory = getWeatherHistory().map((w) => new Weather(w))
	const currentCity = getCurrentCity()
	populateLocationSelect(weatherHistory, currentCity)
	select.classList.toggle("hidden", weatherHistory.length === 0)
}

function showToast(message, type = "info") {
	toast.className = "toast"

	if (type === "success") toast.classList.add("bg-green-600")
	if (type === "error") toast.classList.add("bg-red-600")
	if (type === "info") toast.classList.add("bg-gray-900")

	toastMessage.textContent = message
	toast.classList.remove("hidden")

	setTimeout(() => {
		toast.classList.add("hidden")
	}, 3000)
}

/* -------------------------
	WEATHER ALERTS
------------------------- */
function checkWeatherAlerts(weather) {
	if (!weather) return

	const temp = weather.unit === "C" ? weather.tempC : weather.tempF
	const highThreshold = weather.unit === "C" ? 40 : 104
	const lowThreshold = weather.unit === "C" ? 0 : 32

	if (temp >= highThreshold)
		showToast("⚠️ Extreme heat! Stay hydrated.", "error")
	if (temp <= lowThreshold) showToast("❄️ Extreme cold! Dress warmly.", "error")

	const stormKeywords = ["storm", "thunder", "tornado", "hurricane"]
	if (stormKeywords.some((k) => weather.status.toLowerCase().includes(k)))
		showToast(`⚠️ Weather alert: ${weather.status}`, "error")
}
