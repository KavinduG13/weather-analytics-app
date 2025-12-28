const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const weatherService = require('../services/weatherService');
const citiesData = require('../data/cities.json');

function getCityCodes() {
  return citiesData.List.map(city => city.CityCode);
}

// Add checkJwt middleware back
router.get('/comfort-index', checkJwt, async (req, res, next) => {
  try {
    const cityCodes = getCityCodes();
    const results = await weatherService.processWeatherData(cityCodes);
    
    res.json({
      success: true,
      count: results.length,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

router.get('/cache-status', checkJwt, async (req, res) => {
  const stats = weatherService.getCacheStats();
  res.json({
    success: true,
    cache: stats,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;