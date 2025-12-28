import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { isLoading, isAuthenticated } = useAuth0()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {isAuthenticated ? (
        <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

export default App