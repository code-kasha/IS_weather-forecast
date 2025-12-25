const STORAGE_KEY = "weather_history"
const MAX_ITEMS = 5

export function saveWeather(weather) {
	const existing = getWeatherHistory()

	// prevent duplicate cities
	const filtered = existing.filter(
		(w) => w.city.toLowerCase() !== weather.city.toLowerCase()
	)

	filtered.unshift(weather)

	const limited = filtered.slice(0, MAX_ITEMS)

	localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
}

export function getWeatherHistory() {
	const raw = localStorage.getItem(STORAGE_KEY)
	return raw ? JSON.parse(raw) : []
}

export function clearWeatherHistory() {
	localStorage.removeItem(STORAGE_KEY)
}

export function updateWeather(updatedWeather) {
	const existing = getWeatherHistory()

	const updated = existing.map((item) =>
		item.city.toLowerCase() === updatedWeather.city.toLowerCase()
			? updatedWeather
			: item
	)

	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
