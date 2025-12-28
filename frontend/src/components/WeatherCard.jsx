import { Trophy, Thermometer, Droplets, Wind, Cloud } from 'lucide-react'

function WeatherCard({ city }) {
  const getComfortColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getComfortBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20'
    if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20'
    if (score >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20'
    return 'bg-red-50 dark:bg-red-900/20'
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900'
    if (rank === 2) return 'bg-gray-300 text-gray-900'
    if (rank === 3) return 'bg-orange-400 text-orange-900'
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              {city.cityName}
            </h3>
            <p className="text-blue-100 text-sm">{city.country}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${getRankColor(city.rank)} font-bold text-sm flex items-center gap-1`}>
            {city.rank <= 3 && <Trophy className="w-4 h-4" />}
            #{city.rank}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Weather Description */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${city.weather.icon}@2x.png`}
              alt={city.weather.description}
              className="w-12 h-12"
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {city.weather.description}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(city.temperature)}°C
              </p>
            </div>
          </div>
        </div>

        {/* Comfort Index */}
        <div className={`${getComfortBgColor(city.comfortIndex)} rounded-lg p-3 mb-4`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Comfort Index
            </span>
            <span className={`text-2xl font-bold ${getComfortColor(city.comfortIndex)}`}>
              {city.comfortIndex.toFixed(1)}
            </span>
          </div>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getComfortColor(city.comfortIndex)} bg-current transition-all`}
              style={{ width: `${city.comfortIndex}%` }}
            />
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Feels Like</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {Math.round(city.feelsLike)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Humidity</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {city.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-500" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Wind Speed</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {city.windSpeed.toFixed(1)} m/s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Cloudiness</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {city.cloudiness}%
              </p>
            </div>
          </div>
        </div>

        {/* Cache indicator */}
        {city.cached && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ⚡ Cached data
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherCard