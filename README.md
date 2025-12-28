# Weather Analytics App

A full-stack web application that provides weather analytics with a custom Comfort Index calculation. The app fetches real-time weather data from OpenWeatherMap API, processes it through a proprietary comfort algorithm, and presents the results in an interactive dashboard with authentication via Auth0.

By - Kavindu Karunarathna
Phone - +94 76 811 8141
e-mail - kkgeeshan@gmail.com

## Features

- **Real-time Weather Data**: Fetches current weather conditions for multiple cities
- **Comfort Index Calculation**: Custom algorithm scoring weather comfort on a 0-100 scale
- **Interactive Dashboard**: React-based frontend with responsive design
- **Authentication**: Secure login/logout using Auth0
- **Caching**: In-memory caching to optimize API calls and improve performance
- **Ranking System**: Cities ranked by comfort index for easy comparison

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Auth0 account for authentication
- OpenWeatherMap API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   AUTH0_DOMAIN=your_auth0_domain.auth0.com
   AUTH0_AUDIENCE=your_auth0_api_identifier
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with Auth0 configuration:
   ```
   VITE_AUTH0_DOMAIN=your_auth0_domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   VITE_AUTH0_AUDIENCE=your_auth0_api_identifier
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Running the Application

1. Ensure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. Log in using Auth0 authentication
4. View the weather analytics dashboard

## Comfort Index Formula

The Comfort Index is calculated using a weighted average of four key weather factors:

**Formula:**
```
Comfort Index = (Temperature Score * 0.4) + (Humidity Score * 0.3) + (Wind Speed Score * 0.2) + (Cloudiness Score * 0.1)
```

### Individual Factor Scoring

1. **Temperature (40% weight)** - Optimal range: 20-25°C
   - 20-25°C: 100 points
   - 15-20°C or 25-30°C: Linear decrease to 0
   - Below 15°C or above 30°C: Further penalty

2. **Humidity (30% weight)** - Optimal range: 30-60%
   - 30-60%: 100 points
   - Outside range: Linear decrease to 0

3. **Wind Speed (20% weight)** - Optimal: < 5 m/s
   - ≤5 m/s: 100 points
   - 5-10 m/s: Linear decrease to 50
   - >10 m/s: Further penalty to 0

4. **Cloudiness (10% weight)** - Optimal range: 20-50%
   - 20-50%: 100 points
   - Outside range: Linear decrease to 0

The final score is rounded to 2 decimal places and represents overall weather comfort on a 0-100 scale.

## Reasoning Behind Variable Weights

The weights were assigned based on research into human comfort preferences and the relative impact of each weather factor:

- **Temperature (40%)**: Most influential factor for comfort. Humans are highly sensitive to temperature variations, and maintaining an optimal range is crucial for comfort.
- **Humidity (30%)**: Second most important as it affects how temperature is perceived and can cause discomfort through moisture or dryness.
- **Wind Speed (20%)**: Significant impact on perceived temperature (wind chill effect) and overall comfort, especially in extreme conditions.
- **Cloudiness (10%)**: Least weighted as it has indirect effects on comfort through sunlight exposure and mood, but less direct physical impact.

These weights prioritize physiological comfort factors over aesthetic ones, focusing on what most directly affects human well-being in outdoor conditions.

## Trade-offs Considered

### Simplicity vs. Complexity
- **Chosen Approach**: Simple linear scoring functions for each factor
- **Alternative**: More complex non-linear models or machine learning approaches
- **Trade-off**: Easier to understand and maintain vs. potentially more accurate but harder to interpret

### Equal Weighting vs. Weighted Average
- **Chosen Approach**: Weighted average based on perceived importance
- **Alternative**: Equal weighting of all factors
- **Trade-off**: Better reflects human comfort priorities vs. simpler calculation

### Static Weights vs. Dynamic Weights
- **Chosen Approach**: Fixed weights for all conditions
- **Alternative**: Context-dependent weights (e.g., higher temperature weight in summer)
- **Trade-off**: Consistent and predictable scoring vs. potentially more accurate seasonal adjustments

### Comprehensive Factors vs. Core Factors
- **Chosen Approach**: Four key factors (temperature, humidity, wind, cloudiness)
- **Alternative**: Include additional factors like UV index, air quality, or precipitation
- **Trade-off**: Faster computation and clearer focus vs. more comprehensive comfort assessment

## Cache Design Explanation

The application uses NodeCache for in-memory caching with the following design:

### Configuration
- **TTL (Time To Live)**: 5 minutes (300 seconds)
- **Storage**: In-memory only (no persistence)
- **Key Format**: `weather_${cityCode}`

### Benefits
- **Performance**: Reduces API calls to OpenWeatherMap, improving response times
- **Cost Efficiency**: Minimizes external API usage and potential rate limiting
- **Reliability**: Provides fallback data during temporary API outages

### Implementation Details
- Cache is checked before making API calls
- Fresh data is stored in cache after successful API responses
- Cache statistics are available via `getCacheStats()` function
- No cache invalidation beyond TTL expiration

### Trade-offs
- **Freshness**: Data may be up to 5 minutes old
- **Memory Usage**: Cache consumes server memory
- **Consistency**: All users see the same cached data within the TTL window

## Known Limitations

1. **Data Freshness**: Cached weather data may be up to 5 minutes old, which could be significant during rapidly changing weather conditions.

2. **API Dependency**: Completely reliant on OpenWeatherMap API availability and accuracy. Service disruptions would affect the entire application.

3. **Geographic Coverage**: Limited to cities supported by OpenWeatherMap API. Some locations may not be available.

4. **Comfort Index Subjectivity**: The comfort formula is based on general assumptions and may not reflect individual preferences or specific use cases (e.g., outdoor activities vs. indoor comfort).

5. **No Historical Data**: Only provides current weather conditions, no historical trends or forecasts.

6. **Authentication Scope**: Auth0 integration provides basic authentication but doesn't include role-based access control or advanced user management.

7. **Single Environment**: Designed for development/local use. Production deployment would require additional configuration for security, scaling, and monitoring.

8. **Error Handling**: While basic error handling is implemented, extreme edge cases (malformed API responses, network timeouts) may not be fully covered.

9. **Performance**: No optimization for high concurrent users. Caching helps but may not scale for enterprise use.

10. **Accessibility**: Frontend UI may not fully comply with WCAG accessibility standards.

## Technologies Used

### Backend
- Node.js
- Express.js
- Axios (HTTP client)
- NodeCache (caching)
- Auth0 (authentication)
- CORS

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Auth0 React SDK
- Lucide React (icons)
- Axios (HTTP client)

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/weather` - Get weather data for all cities (requires authentication)
- `GET /api/auth/status` - Check authentication status