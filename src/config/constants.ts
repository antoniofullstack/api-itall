export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  expiresIn: '24h'
};

export const PASSWORD_CONFIG = {
  saltRounds: 10
};

export const ERROR_MESSAGES = {
  EMAIL_IN_USE: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  INTERNAL_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized'
} as const;
