import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import Header from './Header'
import WeatherCard from './WeatherCard'
import LoadingSpinner from './LoadingSpinner'
import { AlertCircle } from 'lucide-react'

function Dashboard({ darkMode, setDarkMode }) {
  const { getAccessTokenSilently, user } = useAuth0()
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('rank')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'weather-app-api'
        }
      })

      const response = await axios.get('http://localhost:5000/api/weather/comfort-index', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setWeatherData(response.data.data)
    } catch (err) {
      console.error('ERROR in fetchWeatherData:')
      console.error('Error message:', err.message)
      console.error('Error name:', err.name)
      console.error('Error response:', err.response?.data)
      console.error('Full error:', err)

      setError(err.response?.data?.error || err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const getSortedAndFilteredData = () => {
    let filtered = weatherData.filter(city =>
      city.cityName.toLowerCase().includes(filterText.toLowerCase()) ||
      city.country.toLowerCase().includes(filterText.toLowerCase())
    )

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.rank - b.rank
        case 'name':
          return a.cityName.localeCompare(b.cityName)
        case 'temperature':
          return b.temperature - a.temperature
        case 'comfort':
          return b.comfortIndex - a.comfortIndex
        default:
          return 0
      }
    })

    return sorted
  }

  if (loading) {
    return (
      <div>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                  Error Loading Data
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-2">{error}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  Check the browser console (F12) for detailed error information.
                </p>
                <button
                  onClick={fetchWeatherData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const sortedData = getSortedAndFilteredData()

  return (
    <div>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Filter by city or country..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rank">Sort by Rank</option>
            <option value="comfort">Sort by Comfort Index</option>
            <option value="name">Sort by Name</option>
            <option value="temperature">Sort by Temperature</option>
          </select>

          <button
            onClick={fetchWeatherData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((city) => (
            <WeatherCard key={city.cityCode} city={city} />
          ))}
        </div>

        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No cities found matching your filter.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard