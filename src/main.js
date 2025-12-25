import "./style.css"

import { getWeather } from "./services/weatherService.js"
import { saveWeather, getWeatherHistory } from "./utils/WeatherStorage.js"

/* -------------------------
   STATE
------------------------- */
let weatherHistory = getWeatherHistory()

/* -------------------------
   DOM ELEMENTS
------------------------- */
const select = document.getElementById("searched_locations")
const searchCity = document.getElementById("search-city")
const errorEl = document.getElementById("error")
const description = document.getElementById("description")

/* -------------------------
   INIT
------------------------- */
populateLocationSelect(weatherHistory)

// show select immediately if history exists
if (weatherHistory.length > 0) {
	select.classList.remove("hidden")
}

/* -------------------------
   EVENTS
------------------------- */
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
	populateLocationSelect(weatherHistory, city) // keep it selected
})

/* -------------------------
   MAIN FUNCTION
------------------------- */
async function displayWeather(cityFromSelect) {
	const cityInput = document.getElementById("weather-city")
	const city = cityFromSelect || cityInput.value.trim()

	// clear error
	errorEl.classList.add("hidden")
	errorEl.textContent = ""

	if (!city) {
		showToast("Please enter a city name", "error")
		return
	}

	/* -------------------------
	   FROM SELECT (NO API)
	------------------------- */
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
		return
	}

	/* -------------------------
	   FROM SEARCH (API)
	------------------------- */
	try {
		console.log("making request")
		const response = await getWeather(city)

		if (!response.success) {
			showToast(response.error, "error")
			return
		}

		const weather = response.data
		showToast("Weather updated successfully", "success")
		// save & sync
		saveWeather(weather)
		syncWeatherHistory()

		// render UI
		renderWeather(weather)
	} catch (err) {
		showToast("Something went wrong. Please try again.", "error")
		console.error(err)
	}
}

/* -------------------------
   HELPERS
------------------------- */
function renderWeather(weather) {
	description.textContent = weather.status
}

//function populateLocationSelect(history) {
//	select.innerHTML = ""

//	const defaultOption = document.createElement("option")
//	defaultOption.textContent = "Select a city"
//	defaultOption.disabled = true
//	defaultOption.selected = true
//	select.appendChild(defaultOption)

//	history.forEach((item) => {
//		const option = document.createElement("option")
//		option.value = item.city
//		option.textContent = `${item.city}, ${item.country}`
//		select.appendChild(option)
//	})
//}

function populateLocationSelect(history, selectedCity = null) {
	// Clear old options
	select.innerHTML = ""

	// Default placeholder
	const defaultOption = document.createElement("option")
	defaultOption.textContent = "Select a city"
	defaultOption.disabled = true
	defaultOption.selected = !selectedCity // select placeholder only if no city
	select.appendChild(defaultOption)

	// Populate cities
	history.forEach((item) => {
		const option = document.createElement("option")
		option.value = item.city
		option.textContent = `${item.city}, ${item.country}`
		// Select current city
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
	weatherHistory = getWeatherHistory()
	populateLocationSelect(weatherHistory)
	select.classList.toggle("hidden", weatherHistory.length === 0)
}

async function displayWeatherFromLocation() {
	if (!navigator.geolocation) {
		showToast("Geolocation is not supported by your browser", "error")
		return
	}
	console.log("in")
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			const { latitude, longitude } = position.coords

			try {
				const response = await getWeather(`${latitude},${longitude}`)

				if (!response.success) {
					showToast(response.error, "error")
					return
				}

				const weather = response.data
				showToast("Weather updated successfully", "success")
				// save & sync like normal search
				saveWeather(weather)
				syncWeatherHistory()
				renderWeather(weather)
			} catch (err) {
				showToast("Weather updated successfully", "success")
				console.error(err)
			}
		},
		(error) => {
			showToast("Weather updated successfully", "success")

			console.warn(error)
		}
	)
}

document
	.getElementById("use-location")
	.addEventListener("click", displayWeatherFromLocation)

const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toast-message")

function showToast(message, type = "info") {
	// Reset styles
	toast.className =
		"fixed top-4 right-4 z-50 max-w-sm rounded-xl px-4 py-3 text-sm text-white shadow-lg transition-all duration-300"

	// Apply type-based colors
	if (type === "success") toast.classList.add("bg-green-600")
	if (type === "error") toast.classList.add("bg-red-600")
	if (type === "info") toast.classList.add("bg-gray-900")

	toastMessage.textContent = message
	toast.classList.remove("hidden")

	// Auto-hide after 3 seconds
	setTimeout(() => {
		toast.classList.add("hidden")
	}, 3000)
}

window.addEventListener("DOMContentLoaded", () => {
	// Only auto-fetch if history is empty
	if (weatherHistory.length === 0) {
		displayWeatherFromLocation()
	}
})
