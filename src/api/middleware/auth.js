import crypto from 'crypto';

/**
 * Telegram Mini App authentication middleware
 * Validates the initData from Telegram WebApp
 */
export const validateTelegramWebAppData = (req, res, next) => {
  try {
    const initData = req.headers['x-telegram-init-data'] || req.body.initData || req.query.initData;

    if (!initData) {
      return res.status(401).json({ error: 'Missing Telegram initialization data' });
    }

    // Parse the init data
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Create data check string
    const dataCheckArr = [];
    for (const [key, value] of urlParams.entries()) {
      dataCheckArr.push(`${key}=${value}`);
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // Generate secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Verify hash
    if (calculatedHash !== hash) {
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }

    // Parse user data
    const userJson = urlParams.get('user');
    if (userJson) {
      req.telegramUser = JSON.parse(userJson);
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Simple API key authentication for development/testing
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};
