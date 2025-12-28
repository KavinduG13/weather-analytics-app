const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Fetch weather data for a city
async function fetchWeatherData(cityCode) {
  const cacheKey = `weather_${cityCode}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return { data: cachedData, cached: true };
  }

  try {
    const response = await axios.get(OPENWEATHER_BASE_URL, {
      params: {
        id: cityCode,
        appid: API_KEY,
        units: 'metric' // Get temperature in Celsius
      }
    });

    // Store in cache
    cache.set(cacheKey, response.data);
    
    return { data: response.data, cached: false };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

/*
Calculate Comfort Index Score (0-100)

Formula uses:
Temperature (optimal: 20-25°C) - 40% weight
Humidity (optimal: 30-60%) - 30% weight
Wind Speed (optimal: < 5 m/s) - 20% weight
Cloudiness (optimal: 20-50%) - 10% weight

Each factor is weighted and scored, then combined
 */
function calculateComfortIndex(weatherData) {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const cloudiness = weatherData.clouds.all;

  // Temperature score (40% weight)
  // Optimal range: 20-25°C
  let tempScore;
  if (temp >= 20 && temp <= 25) {
    tempScore = 100;
  } else if (temp >= 15 && temp < 20) {
    tempScore = 100 - ((20 - temp) * 10);
  } else if (temp > 25 && temp <= 30) {
    tempScore = 100 - ((temp - 25) * 10);
  } else if (temp < 15) {
    tempScore = Math.max(0, 50 - ((15 - temp) * 5));
  } else {
    tempScore = Math.max(0, 50 - ((temp - 30) * 5));
  }

  // Humidity score (30% weight)
  // Optimal range: 30-60%
  let humidityScore;
  if (humidity >= 30 && humidity <= 60) {
    humidityScore = 100;
  } else if (humidity < 30) {
    humidityScore = Math.max(0, 100 - ((30 - humidity) * 2));
  } else {
    humidityScore = Math.max(0, 100 - ((humidity - 60) * 2));
  }

  // Wind speed score (20% weight)
  // Optimal: < 5 m/s
  let windScore;
  if (windSpeed <= 5) {
    windScore = 100;
  } else if (windSpeed <= 10) {
    windScore = 100 - ((windSpeed - 5) * 10);
  } else {
    windScore = Math.max(0, 50 - ((windSpeed - 10) * 5));
  }

  // Cloudiness score (10% weight)
  // Optimal: 20-50% (partly cloudy)
  let cloudinessScore;
  if (cloudiness >= 20 && cloudiness <= 50) {
    cloudinessScore = 100;
  } else if (cloudiness < 20) {
    cloudinessScore = 80 + cloudiness;
  } else {
    cloudinessScore = Math.max(0, 100 - ((cloudiness - 50) * 1));
  }

  // Calculate weighted average
  const comfortIndex = (
    (tempScore * 0.4) +
    (humidityScore * 0.3) +
    (windScore * 0.2) +
    (cloudinessScore * 0.1)
  );

  return Math.round(comfortIndex * 100) / 100; // Round to 2 decimal places
}


// Process multiple cities

async function processWeatherData(cityCodes) {
  const results = [];
  
  for (const cityCode of cityCodes) {
    try {
      const { data, cached } = await fetchWeatherData(cityCode);
      const comfortIndex = calculateComfortIndex(data);
      
      results.push({
        cityCode: data.id,
        cityName: data.name,
        country: data.sys.country,
        weather: {
          description: data.weather[0].description,
          main: data.weather[0].main,
          icon: data.weather[0].icon
        },
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cloudiness: data.clouds.all,
        pressure: data.main.pressure,
        visibility: data.visibility,
        comfortIndex: comfortIndex,
        cached: cached
      });
    } catch (error) {
      console.error(`Error processing city ${cityCode}:`, error.message);
    }
  }

  // Sort by comfort index (highest first)
  results.sort((a, b) => b.comfortIndex - a.comfortIndex);

  // Add rank
  results.forEach((city, index) => {
    city.rank = index + 1;
  });

  return results;
}


// Get cache statistics

function getCacheStats() {
  const keys = cache.keys();
  const stats = keys.map(key => ({
    key,
    ttl: cache.getTtl(key),
    hasValue: cache.has(key)
  }));

  return {
    totalKeys: keys.length,
    keys: stats
  };
}

module.exports = {
  fetchWeatherData,
  calculateComfortIndex,
  processWeatherData,
  getCacheStats
};