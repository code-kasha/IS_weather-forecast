import "./style.css"

import { getWeather } from "./services/weatherService.js"

const description = document.getElementById("description")

async function displayWeather(city) {
	const response = await getWeather(city)

	if (response.success) {
		const weather = response.data
		console.log(weather)

		description.innerHTML = weather.getDescription()
	} else {
		console.error(response.error)
		document.body.innerHTML = `<p>Error: ${response.error}</p>`
	}
}

displayWeather("Mumbai")
