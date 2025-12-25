import { Weather } from "../models/Weather.js"

const API_KEY = import.meta.env.VITE_API_KEY

if (!API_KEY) {
	throw new Error("VITE_API_KEY is missing in .env")
}

/**
 * Fetches current + 5-day forecast weather data
 * @param {string} city
 * @returns {Promise<{success: boolean, data: Weather|null, error: string|null}>}
 */
export async function getWeather(city) {
	try {
		const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
			city
		)}&aqi=no`

		const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
			city
		)}&days=5&aqi=no`

		const [resCurrent, resForecast] = await Promise.all([
			fetch(currentUrl),
			fetch(forecastUrl),
		])

		if (!resCurrent.ok) {
			return {
				success: false,
				data: null,
				error: `Failed to fetch weather data: ${resCurrent.status} ${resCurrent.statusText}`,
			}
		}

		if (!resForecast.ok) {
			return {
				success: false,
				data: null,
				error: `Failed to fetch weather forecast: ${resForecast.status} ${resForecast.statusText}`,
			}
		}

		const currentData = await resCurrent.json()
		const forecastData = await resForecast.json()

		/* -------------------------
			Normalize forecast
		------------------------- */
		const forecast = forecastData.forecast.forecastday.map((day) => ({
			date: day.date,
			minTempC: day.day.mintemp_c,
			maxTempC: day.day.maxtemp_c,
			minTempF: day.day.mintemp_f,
			maxTempF: day.day.maxtemp_f,
			condition: day.day.condition.text,
			icon: day.day.condition.icon,
		}))

		/* -------------------------
			Create Weather object
		------------------------- */
		const weather = new Weather({
			// Location
			city: currentData.location.name,
			state: currentData.location.region,
			country: currentData.location.country,

			// Date / Time
			tz: currentData.location.tz_id,
			time: currentData.location.localtime,

			// Temperature
			tempC: currentData.current.temp_c,
			tempF: currentData.current.temp_f,
			feelsLikeC: currentData.current.feelslike_c,
			feelsLikeF: currentData.current.feelslike_f,
			heatIndexC: currentData.current.heatindex_c,
			heatIndexF: currentData.current.heatindex_f,
			uv: currentData.current.uv,

			// Current
			updated: currentData.current.last_updated,
			isDay: currentData.current.is_day,

			// Weather
			status: currentData.current.condition.text,
			icon: currentData.current.condition.icon,
			humidity: currentData.current.humidity,
			wind: currentData.current.wind_kph,

			// Forecast
			forecast,
		})

		return {
			success: true,
			data: weather,
			error: null,
		}
	} catch (err) {
		return {
			success: false,
			data: null,
			error: err.message || "An unknown error occurred",
		}
	}
}
