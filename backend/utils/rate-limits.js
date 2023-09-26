const Bottleneck = require('bottleneck')

// in calls/second
const onboardingRateLimit = 35

// maxConcurrent: # of calls at the same time
// minTime: Time in ms between each API call

const onboardingRateLimiter = new Bottleneck({
  maxConcurrent: 8,
  minTime: 1000 / onboardingRateLimit,
})

module.exports = { onboardingRateLimiter }






