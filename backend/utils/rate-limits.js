const Bottleneck = require('bottleneck')

// in calls/second
const onboardingRateLimit = 35
const dbUpdateRateLimit = 10

// maxConcurrent: # of calls at the same time
// minTime: Time in ms between each API call

const onboardingRateLimiter = new Bottleneck({
  maxConcurrent: 8,
  minTime: 1000 / onboardingRateLimit,
});

const dbUpdateRateLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 / dbUpdateRateLimit,
});


module.exports = {
  onboardingRateLimiter,
  dbUpdateRateLimiter
}






