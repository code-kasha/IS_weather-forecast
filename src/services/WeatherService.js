import { Weather } from "../models/Weather.js"

const API_KEY = import.meta.env.VITE_API_KEY

if (!API_KEY) {
	throw new Error("VITE_API_KEY is missing in .env")
}

/**
 * Fetches weather data from WeatherAPI.com and returns a structured response
 * @param {string} city - City name
 * @returns {Promise<{success: boolean, data: Weather|null, error: string|null}>}
 */
export async function getWeather(city) {
	try {
		const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
			city
		)}&aqi=no`

		const res = await fetch(url)

		if (!res.ok) {
			return {
				success: false,
				data: null,
				error: `Failed to fetch weather data: ${res.status} ${res.statusText}`,
			}
		}

		const data = await res.json()

		const weather = new Weather({
			// Location
			city: data.location.name,
			state: data.location.region,
			country: data.location.country,

			// Date - Time
			tz: data.location.tz_id,
			time: data.location.localtime,

			// Temperature
			tempC: data.current.temp_c,
			tempF: data.current.temp_f,
			feelsLikeC: data.current.feelslike_c,
			feelsLikeF: data.current.feelslike_f,
			heatIndexC: data.current.heatindex_c,
			heatIndexF: data.current.heatindex_f,
			uv: data.current.uv,

			// Current
			updated: data.current.last_updated,
			isDay: data.current.is_day,

			// Weather
			status: data.current.condition.text,
			icon: data.current.condition.icon,
			humidity: data.current.humidity,
			wind: data.current.wind_kph,
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
