import { useAuth0 } from '@auth0/auth0-react'
import { Cloud, Lock } from 'lucide-react'

function LoginPage() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Weather Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the most comfortable cities worldwide
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => loginWithRedirect()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <Lock className="w-5 h-5" />
              Sign In
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Secure authentication powered by Auth0</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p className="mb-2">Test Credentials:</p>
              <p className="font-mono">careers@fidenz.com</p>
              <p className="font-mono">Pass#fidenz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage