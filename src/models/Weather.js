export class Weather {
	constructor({
		city,
		state,
		country,
		lat,
		lon,
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
	}) {
		this.city = city
		this.state = state
		this.country = country
		this.lat = lat
		this.lon = lon
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
	}

	// Returns a formatted temperature string (Celsius)
	getTemperature() {
		return `${Math.round(this.tempC)}°C`
	}

	// Returns a formatted temperature string (Fahrenheit)
	getTemperatureF() {
		return `${Math.round(this.tempF)}°F`
	}

	// Returns full description
	getDescription() {
		return `${this.status} in ${this.city}, ${
			this.state ? this.state + ", " : ""
		}${this.country}`
	}

	getFormattedTime() {
		if (!this.time) return ""

		const [date, time] = this.time.split(" ")
		const [year, month, day] = date.split("-")

		return `${time}, ${day}/${month}/${year.slice(2)}. ${this.tz}`
	}

	// Returns full icon URL
	getIconUrl() {
		return `https:${this.icon}`
	}
}
