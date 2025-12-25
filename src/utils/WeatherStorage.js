// -------------------------------------------
// WeatherStorage.js
// Handles saving weather history and current city
// -------------------------------------------

const STORAGE_KEY = "weather_history"
const CURRENT_CITY_KEY = "current_city"
const MAX_ITEMS = 5

/**
 * Save a weather object to localStorage
 * Keeps only the latest MAX_ITEMS entries
 */
export function saveWeather(weather) {
	const existing = getWeatherHistory()
	const filtered = existing.filter(
		(w) => w.city.toLowerCase() !== weather.city.toLowerCase()
	)
	filtered.unshift(weather)
	const limited = filtered.slice(0, MAX_ITEMS)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
}

/**
 * Get all saved weather history
 */
export function getWeatherHistory() {
	const raw = localStorage.getItem(STORAGE_KEY)
	return raw ? JSON.parse(raw) : []
}

/**
 * Clear all saved weather history
 */
export function clearWeatherHistory() {
	localStorage.removeItem(STORAGE_KEY)
}

/**
 * Update a specific weather object in storage
 */
export function updateWeather(updatedWeather) {
	const existing = getWeatherHistory()
	const updated = existing.map((item) =>
		item.city.toLowerCase() === updatedWeather.city.toLowerCase()
			? updatedWeather
			: item
	)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

/* -------------------------
   CURRENT CITY
------------------------- */

/**
 * Get the current city from localStorage
 */
export function getCurrentCity() {
	return localStorage.getItem(CURRENT_CITY_KEY) || null
}

/**
 * Set the current city in localStorage
 * @param {string} city
 */
export function setCurrentCity(city) {
	localStorage.setItem(CURRENT_CITY_KEY, city)
}
