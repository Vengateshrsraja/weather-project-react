import React, { useState } from 'react';
import axios from 'axios';
import sun from '../images/sunpicture.png';
import clearSky from '../images/clear-skypicture.png';
import cloudy from '../images/cloudypicture.png';
import rain from '../images/rainpicture.png';
import storm from '../images/stormpicture.png';
import sunny from '../images/sun-and-cloudpicture.png';
import wind from '../images/windpicture.png';
import search from '../images/searchpicture.png';

const weatherMap = {
    "01d": sun,
    "01n": clearSky,
    "02d": cloudy,
    "02n": cloudy,
    "03d": cloudy,
    "03n": cloudy,
    "04d": cloudy,
    "04n": cloudy,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "11d": storm,
    "11n": storm,
    "13d": sunny,
    "13n": sunny,
    "50d": wind,
    "50n": wind
};

const WeatherDetails = ({ icon, temperature, city, country, latitude, longitude, humidity, wind }) => {
    return (
        <div className="weather-details">
            <div className="image">
                <img src={icon} alt="weather icon"/>
            </div>
            <div className="temperature">{temperature}°C</div>
            <div className="city">{city}</div>
            <div className="country">{country}</div>
            <div className="coordinates">
                <div>Latitude: {latitude}</div>
                <div>Longitude: {longitude}</div>
            </div>
            <div className="additional-info">
                <div>Humidity: {humidity}%</div>
                <div>Wind Speed: {wind} km/hr</div>
            </div>
        </div>
    );
};

const Myweather = () => {
    const [input, setInput] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async (city) => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=dbc21575cd46300dc3aa14b0fcbe5645&units=metric`);
            console.log('API Response:', res.data);
            const data = res.data;

            if (data.cod && data.cod !== 200) {
                throw new Error(data.message);
            }

            setWeather({
                temperature: data.main.temp,
                city: data.name,
                country: data.sys.country,
                latitude: data.coord.lat,
                longitude: data.coord.lon,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                icon: weatherMap[data.weather[0].icon] || clearSky
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (input) {
            fetchWeather(input);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="weather">
            <div className="input-container">
                <input
                    type="text"
                    className="city-input"
                    placeholder="Enter the city Name"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={input}
                />
                <div className="search-icon" onClick={handleSearch}>
                    <img src={search} alt="search icon" />
                </div>
            </div>
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {weather && !loading && !error && (
                <WeatherDetails
                    icon={weather.icon}
                    temperature={weather.temperature}
                    city={weather.city}
                    country={weather.country}
                    latitude={weather.latitude}
                    longitude={weather.longitude}
                    humidity={weather.humidity}
                    wind={weather.wind}
                />
            )}
        </div>
    );
};

export default Myweather;
