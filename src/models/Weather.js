export class Weather {
	constructor({
		// location
		city,
		state,
		country,
		tz,
		time,

		// current
		tempC,
		tempF,
		status,
		updated,
		isDay,
		icon,
		humidity,
		wind,
		feelsLikeC,
		feelsLikeF,
		heatIndexC,
		heatIndexF,
		uv,

		// forecast (optional)
		forecast = [],

		// unit
		unit = "C",
	}) {
		// Location
		this.city = city
		this.state = state
		this.country = country
		this.tz = tz
		this.time = time

		// Current
		this.tempC = tempC
		this.tempF = tempF
		this.status = status
		this.updated = updated
		this.isDay = isDay
		this.icon = icon
		this.humidity = humidity
		this.wind = wind
		this.feelsLikeC = feelsLikeC
		this.feelsLikeF = feelsLikeF
		this.heatIndexC = heatIndexC
		this.heatIndexF = heatIndexF
		this.uv = uv

		// Forecast
		this.forecast = forecast

		// Unit
		this.unit = unit || "C"
	}

	/* -------------------------
	   UNIT HANDLING
	------------------------- */

	getC() {
		return `${this.city}, ${this.getTemperature()}`
	}

	toggleUnit() {
		this.unit = this.unit === "C" ? "F" : "C"
	}

	getTemperature() {
		return this.unit === "C"
			? `${Math.round(this.tempC)}°C`
			: `${Math.round(this.tempF)}°F`
	}

	getFeelsLike() {
		return this.unit === "C"
			? `${Math.round(this.feelsLikeC)}°C`
			: `${Math.round(this.feelsLikeF)}°F`
	}

	getHeatIndex() {
		return this.unit === "C"
			? `${Math.round(this.heatIndexC)}°C`
			: `${Math.round(this.heatIndexF)}°F`
	}

	/* -------------------------
	   DESCRIPTION & TIME
	------------------------- */

	getDescription() {
		return `${this.status} in ${this.city}, ${
			this.state ? this.state + ", " : ""
		}${this.country}`
	}

	getFormattedTime() {
		if (!this.time) return ""

		const [date, time] = this.time.split(" ")
		const [year, month, day] = date.split("-")

		return `${time}, ${day}/${month}/${year.slice(2)} • ${this.tz}`
	}

	getFormattedUTime() {
		if (!this.updated) return ""

		const [date, time] = this.updated.split(" ")
		const [year, month, day] = date.split("-")

		return `${time}, ${day}/${month}/${year.slice(2)}`
	}

	getIconUrl() {
		return `https:${this.icon}`
	}

	/* -------------------------
	   FORECAST HELPERS
	   (Safe even if empty)
	------------------------- */

	getForecast() {
		return this.forecast.map((day) => ({
			date: day.date,
			min:
				this.unit === "C"
					? `${Math.round(day.minTempC)}°C`
					: `${Math.round(day.minTempF)}°F`,
			max:
				this.unit === "C"
					? `${Math.round(day.maxTempC)}°C`
					: `${Math.round(day.maxTempF)}°F`,
			icon: `https:${day.icon}`,
			condition: day.condition,
		}))
	}
}
