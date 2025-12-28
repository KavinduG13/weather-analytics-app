const { calculateComfortIndex } = require('../src/services/weatherService');

describe('Comfort Index Calculation', () => {
  
  test('should return 100 for perfect conditions', () => {
    const perfectWeather = {
      main: {
        temp: 22.5,      // Optimal: 20-25°C
        humidity: 45     // Optimal: 30-60%
      },
      wind: {
        speed: 3         // Optimal: < 5 m/s
      },
      clouds: {
        all: 35          // Optimal: 20-50%
      }
    };
    
    const score = calculateComfortIndex(perfectWeather);
    expect(score).toBe(100);
  });

  test('should return high score for good weather', () => {
    const goodWeather = {
      main: {
        temp: 24,
        humidity: 55
      },
      wind: {
        speed: 4
      },
      clouds: {
        all: 40
      }
    };
    
    const score = calculateComfortIndex(goodWeather);
    expect(score).toBeGreaterThan(85);
  });

  test('should return low score for extreme heat', () => {
    const hotWeather = {
      main: {
        temp: 40,        // Very hot
        humidity: 80     // High humidity
      },
      wind: {
        speed: 12        // Strong wind
      },
      clouds: {
        all: 0
      }
    };
    
    const score = calculateComfortIndex(hotWeather);
    expect(score).toBeLessThan(50);
  });

  test('should return low score for extreme cold', () => {
    const coldWeather = {
      main: {
        temp: -5,        // Very cold
        humidity: 20     // Low humidity
      },
      wind: {
        speed: 15        // Very strong wind
      },
      clouds: {
        all: 100
      }
    };
    
    const score = calculateComfortIndex(coldWeather);
    expect(score).toBeLessThan(50);
  });

  // BVA (Boundary Value Analysis)
  test('should handle boundary temperatures correctly', () => {
    const boundaryWeather = {
      main: {
        temp: 20,        // Lower boundary of optimal
        humidity: 30     // Lower boundary of optimal
      },
      wind: {
        speed: 5         // Upper boundary of optimal
      },
      clouds: {
        all: 20          // Lower boundary of optimal
      }
    };
    
    const score = calculateComfortIndex(boundaryWeather);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  test('should always return score between 0 and 100', () => {
    const extremeWeather = {
      main: {
        temp: 50,
        humidity: 100
      },
      wind: {
        speed: 50
      },
      clouds: {
        all: 100
      }
    };
    
    const score = calculateComfortIndex(extremeWeather);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

});