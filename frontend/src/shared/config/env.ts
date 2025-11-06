/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  // Application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'JulaazNG',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',

  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',

  // Feature Flags
  FEATURE_ARTISAN_MARKETPLACE:
    import.meta.env.VITE_FEATURE_ARTISAN_MARKETPLACE === 'true',
  FEATURE_PROPERTY_MANAGEMENT:
    import.meta.env.VITE_FEATURE_PROPERTY_MANAGEMENT === 'true',
  FEATURE_SHORT_LET: import.meta.env.VITE_FEATURE_SHORT_LET === 'true',

  // Development
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const

export type Env = typeof env

