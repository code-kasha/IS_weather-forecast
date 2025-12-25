export class Weather {
	constructor({
		city,
		state,
		country,
		tz,
		time,
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
		unit,
	}) {
		this.city = city
		this.state = state
		this.country = country
		this.tz = tz
		this.time = time
		this.tempC = tempC
		this.tempF = tempF
		this.status = status
		this.updated = updated
		this.isDay = isDay
		this.status = status
		this.icon = icon
		this.humidity = humidity
		this.wind = wind
		this.feelsLikeC = feelsLikeC
		this.feelsLikeF = feelsLikeF
		this.heatIndexC = heatIndexC
		this.heatIndexF = heatIndexF
		this.uv = uv
		this.unit = "C"
	}

	getC() {
		return `${this.city}, ${this.getTemperature()}`
	}

	// Toggles C and F
	toggleUnit() {
		this.unit = this.unit === "C" ? "F" : "C"
	}

	// Returns Formated Temperature
	getTemperature() {
		return this.unit === "C"
			? `${Math.round(this.tempC)}°C`
			: `${Math.round(this.tempF)}°F`
	}

	// Returns Formated Feels Like Temperature
	getFeelsLike() {
		return this.unit === "C"
			? `${Math.round(this.feelsLikeC)}°C`
			: `${Math.round(this.feelsLikeF)}°F`
	}

	// Returns Formated Heat Index
	getHeatIndex() {
		return this.unit === "C"
			? `${Math.round(this.heatIndexC)}°C`
			: `${Math.round(this.heatIndexF)}°F`
	}

	// Returns full description
	getDescription() {
		return `${this.status} in ${this.city}, ${
			this.state ? this.state + ", " : ""
		}${this.country}`
	}

	// Returns Formated
	getFormattedTime() {
		if (!this.time) return ""

		const [date, time] = this.time.split(" ")
		const [year, month, day] = date.split("-")

		return `${time}, ${day}/${month}/${year.slice(2)}. ${this.tz}`
	}

	getFormattedUTime() {
		if (!this.updated) return ""

		const [date, time] = this.updated.split(" ")
		const [year, month, day] = date.split("-")

		return `${time}, ${day}/${month}/${year.slice(2)}.`
	}

	// Returns full icon URL
	getIconUrl() {
		return `https:${this.icon}`
	}
}
