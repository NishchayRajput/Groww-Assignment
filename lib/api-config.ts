// Update this file with your Alpha Vantage API key
// Get your free key at: https://www.alphavantage.co/

export const API_CONFIG = {
  // 🔑 Replace 'demo' with your actual API key from Alpha Vantage
  apiKey: 'demo', // CHANGE THIS to your key
  
  // API endpoint
  endpoint: 'https://www.alphavantage.co/query',
  
  // Rate limits with free tier
  rateLimits: {
    perMinute: 5,
    perDay: 500,
    description: 'Free tier allows 5 calls per minute, 500 per day'
  }
}

/**
 * HOW TO SET UP YOUR API KEY
 * 
 * 1. Visit: https://www.alphavantage.co/
 * 2. Sign up for FREE account
 * 3. Copy your API key from your dashboard
 * 4. In /components/chart-widget.tsx, line 18:
 *    Replace: const API_KEY = 'demo'
 *    With:    const API_KEY = 'YOUR_API_KEY_HERE'
 * 
 * Done! The app will start fetching real data immediately.
 */
