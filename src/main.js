import "./style.css"

import { getWeather } from "./services/weatherService.js"
import { saveWeather, getWeatherHistory } from "./utils/WeatherStorage.js"

let weatherHistory = getWeatherHistory()
const select = document.getElementById("searched_locations")

select.addEventListener("change", (e) => {
	const city = e.target.value

	const weather = weatherHistory.find(
		(w) => w.city.toLowerCase() === city.toLowerCase()
	)

	if (!weather) return

	renderWeather(weather)
})

function renderWeather(weather) {
	description.textContent = weather.status
}

function populateLocationSelect(history) {
	// Clear old options
	select.innerHTML = ""

	// Default option
	const defaultOption = document.createElement("option")
	defaultOption.textContent = "Select a city"
	defaultOption.disabled = true
	defaultOption.selected = true
	select.appendChild(defaultOption)

	history.forEach((item) => {
		const option = document.createElement("option")
		option.value = item.city
		option.textContent = `${item.city}, ${item.country}`
		select.appendChild(option)
	})
}

const searchCity = document.getElementById("search-city")

const errorEl = document.getElementById("error")

async function displayWeather(cityFromSelect) {
	const cityInput = document.getElementById("weather-city")
	const city = cityFromSelect || cityInput.value.trim()

	// Clear previous error
	errorEl.classList.add("hidden")
	errorEl.textContent = ""

	if (!city) {
		showError("Please enter a city name")
		return
	}

	/* -------------------------
	   CASE 1: From <select>
	   ------------------------- */
	if (cityFromSelect) {
		const weatherHistory = getWeatherHistory()

		const cachedWeather = weatherHistory.find(
			(w) => w.city.toLowerCase() === city.toLowerCase()
		)

		if (!cachedWeather) {
			showError("City not found in history")
			return
		}

		// 🔥 render from memory only
		renderWeather(cachedWeather)
		return
	}

	/* -------------------------
	   CASE 2: From search/submit
	   ------------------------- */
	try {
		const response = await getWeather(city)

		if (!response.success) {
			showError(response.error)
			return
		}

		const weather = response.data

		// save / update storage
		saveWeather(weather)
		weatherHistory = getWeatherHistory()

		if (weatherHistory.length > 0) select.classList.remove("hidden")

		// update dropdown
		populateLocationSelect(getWeatherHistory())

		// render UI
		renderWeather(weather)

		console.log(weather)
	} catch (err) {
		showError("Something went wrong. Please try again.")
		console.error(err)
	}
}

searchCity.addEventListener("click", (e) => {
	e.preventDefault()
	displayWeather()
})

function showError(message) {
	errorEl.textContent = message
	errorEl.classList.remove("hidden")
}

populateLocationSelect(weatherHistory)
