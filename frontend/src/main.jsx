import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-4770rqv2qmaut5c3.us.auth0.com"
      clientId="Vb0FHKe6cFva9mOsdjax0jj6nbwkdrKi"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "weather-app-api"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)