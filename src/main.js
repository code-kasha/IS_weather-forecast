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
	displayWeather(e.target.value)
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
		showError("Please enter a city name")
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
			showError("City not found in history")
			return
		}

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
			showError(response.error)
			return
		}

		const weather = response.data

		// save & sync
		saveWeather(weather)
		syncWeatherHistory()

		// render UI
		renderWeather(weather)
	} catch (err) {
		showError("Something went wrong. Please try again.")
		console.error(err)
	}
}

/* -------------------------
   HELPERS
------------------------- */
function renderWeather(weather) {
	description.textContent = weather.status
}

function populateLocationSelect(history) {
	select.innerHTML = ""

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

function syncWeatherHistory() {
	weatherHistory = getWeatherHistory()
	populateLocationSelect(weatherHistory)
	select.classList.toggle("hidden", weatherHistory.length === 0)
}

function showError(message) {
	errorEl.textContent = message
	errorEl.classList.remove("hidden")
}

async function displayWeatherFromLocation() {
	if (!navigator.geolocation) {
		showError("Geolocation is not supported by your browser")
		return
	}
	console.log("in")
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			const { latitude, longitude } = position.coords

			try {
				const response = await getWeather(`${latitude},${longitude}`)

				if (!response.success) {
					showError(response.error)
					return
				}

				const weather = response.data

				// save & sync like normal search
				saveWeather(weather)
				syncWeatherHistory()
				renderWeather(weather)
			} catch (err) {
				showError("Unable to fetch weather for your location")
				console.error(err)
			}
		},
		(error) => {
			showError("Location access denied")
			console.warn(error)
		}
	)
}

document
	.getElementById("use-location")
	.addEventListener("click", displayWeatherFromLocation)
