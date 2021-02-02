const fetch = require('node-fetch')

module.exports = {
  name: 'phone',
  
  challenge: async (responseUrl, member) => {
    await fetch(
      `https://verify.twilio.com/v2/Services/${process.env.twilioVerificationServiceId}/Verifications`,
      
    )
  },
  
  verify: async (value) => { return false },

  findUnverified: (now) => {
    // return members
  }
}