# Weather Forecast Application 🌦️

## Project Overview

This project is a **Weather Forecast Application** developed using **JavaScript, HTML, and Tailwind CSS**.  
The application retrieves real-time and forecast weather data from a public Weather API and displays it through a clean, responsive, and user-friendly interface.

The app allows users to:

- Search weather by city name
- Get weather for their current location
- View current weather conditions
- View extended weather forecasts
- Toggle temperature units and receive weather alerts

---

## Objective

The objective of this project is to design and develop a weather forecasting application that demonstrates:

- API integration
- Responsive UI design using Tailwind CSS
- User interaction handling
- Data validation and error handling
- Proper version control and documentation practices

---

## Tech Stack

- HTML5
- JavaScript (ES6+)
- Tailwind CSS
- Weather API (OpenWeatherMap / WeatherAPI)
- Local Storage / Session Storage
- Git & GitHub

---

## Features

### 1. Project Setup

- Well-structured project using separate HTML, CSS, and JavaScript files
- Tailwind CSS used for styling
- Git used for version control
- Minimum **12 meaningful commits** with proper commit messages
- Separate commits for HTML, CSS, JavaScript, and README files

---

### 2. Weather API Integration

- Integrated a public Weather API
- Fetches real-time weather data using asynchronous JavaScript
- Handles API responses and errors properly

---

### 3. User Interface Design

- Simple and intuitive UI built with Tailwind CSS
- Fully responsive design for:
  - Desktop
  - iPad Mini
  - iPhone SE
- Custom UI design without copying reference layouts
- Creative use of layout, colors, spacing, and icons

---

### 4. Location-Based Weather Forecast

#### Search & Location Features

- Search weather by city name
- Fetch weather using the user’s current location

#### User Interaction

- Input fields and buttons for searching locations
- Dropdown menu for recently searched cities
  - Cities stored using local/session storage
  - Dropdown appears only after at least one search
  - Selecting a city updates the weather data

#### Validation & Event Handling

- Validates empty and invalid search inputs
- Displays user-friendly error messages
- Uses event listeners for all user interactions

#### Weather Data Display

- Current temperature
- Humidity
- Wind speed
- Weather condition icons
- Dynamic background changes based on weather (e.g., rainy background for rain)

#### Additional Features

- Temperature unit toggle (**°C / °F**) for today’s temperature
- Custom alerts for extreme temperatures (e.g., above 40°C)

---

### 5. Extended Forecast Display

- Displays a multi-day weather forecast (e.g., 5-day forecast)
- Forecast cards include:
  - Date
  - Temperature
  - Wind speed
  - Humidity
  - Relevant icons
- Organized and visually appealing layout

---

### 6. Error Handling and Validation

- Handles API and network errors gracefully
- Displays error messages clearly on the UI
- Uses custom messages or text instead of JavaScript alert boxes

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. Navigate to the project directory

   ```bash
   cd weather-forecast-app
   ```

3. Add your Weather API key in the javascript file

   ```bash
   const API_KEY = "YOUR_API_KEY_HERE"
   ```

4. Start The Project. (vite .) or (npm run dev)
