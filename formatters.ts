/**
 * Formatter Utilities for Weather Dashboard
 * Status: Production-ready
 * 
 * Functions:
 * - Temperature formatting (C/F conversion)
 * - Date/Time formatting
 * - Wind speed formatting
 * - Weather icon mapping
 * - Pressure formatting
 */

import { TemperatureUnit } from '../types/weather';

/**
 * Convert Celsius to Fahrenheit
 */
const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

/**
 * Format temperature with unit symbol
 * @param temp Temperature in Celsius
 * @param unit Temperature unit (metric/imperial)
 * @returns Formatted string like "25°C" or "77°F"
 */
export const formatTemperature = (
  temp: number,
  unit: TemperatureUnit = 'metric'
): string => {
  if (unit === 'imperial') {
    return `${Math.round(celsiusToFahrenheit(temp))}°F`;
  }
  return `${Math.round(temp)}°C`;
};

/**
 * Format date from Unix timestamp
 * @param timestamp Unix timestamp
 * @param format 'short' | 'long' | 'dayname'
 * @returns Formatted date string
 */
export const formatDate = (
  timestamp: number,
  format: 'short' | 'long' | 'dayname' = 'short'
): string => {
  const date = new Date(timestamp * 1000);

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

    case 'dayname':
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
      });

    default:
      return date.toLocaleString();
  }
};

/**
 * Format time from Unix timestamp
 * @param timestamp Unix timestamp
 * @returns Formatted time like "14:30"
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Format wind speed (m/s to km/h or mph)
 * @param speed Speed in m/s
 * @param unit Temperature unit (to determine output unit)
 * @returns Formatted string like "18 km/h" or "11 mph"
 */
export const formatWindSpeed = (
  speed: number,
  unit: TemperatureUnit = 'metric'
): string => {
  if (unit === 'imperial') {
    // m/s to mph: multiply by 2.237
    const mph = Math.round(speed * 2.237);
    return `${mph} mph`;
  }
  // m/s to km/h: multiply by 3.6
  const kmh = Math.round(speed * 3.6);
  return `${kmh} km/h`;
};

/**
 * Format pressure in hPa to display string
 * @param pressure Pressure in hPa
 * @returns Formatted string like "1013 hPa"
 */
export const formatPressure = (pressure: number): string => {
  return `${Math.round(pressure)} hPa`;
};

/**
 * Format humidity percentage
 * @param humidity Humidity value 0-100
 * @returns Formatted string like "65%"
 */
export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

/**
 * Get weather icon emoji based on OpenWeatherMap icon code
 * @param iconCode OpenWeatherMap icon code (e.g., "01d", "02n")
 * @returns Weather description string
 */
export const getWeatherEmoji = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    // Clear sky
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night

    // Few clouds
    '02d': '⛅', // few clouds day
    '02n': '🌙', // few clouds night

    // Scattered clouds
    '03d': '☁️', // scattered clouds day
    '03n': '☁️', // scattered clouds night

    // Broken clouds
    '04d': '☁️', // broken clouds day
    '04n': '☁️', // broken clouds night

    // Shower rain
    '09d': '🌧️', // shower rain day
    '09n': '🌧️', // shower rain night

    // Rain
    '10d': '🌧️', // rain day
    '10n': '🌧️', // rain night

    // Thunderstorm
    '11d': '⛈️', // thunderstorm day
    '11n': '⛈️', // thunderstorm night

    // Snow
    '13d': '❄️', // snow day
    '13n': '❄️', // snow night

    // Mist
    '50d': '🌫️', // mist day
    '50n': '🌫️', // mist night
  };

  return iconMap[iconCode] || '🌤️'; // Default emoji
};

/**
 * Get weather description from condition
 * @param description Raw description from API
 * @returns Capitalized description
 */
export const formatWeatherDescription = (description: string): string => {
  return description
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format visibility in meters to km or miles
 * @param visibility Visibility in meters
 * @param unit Temperature unit
 * @returns Formatted string like "10 km" or "6.2 mi"
 */
export const formatVisibility = (
  visibility: number,
  unit: TemperatureUnit = 'metric'
): string => {
  if (unit === 'imperial') {
    // meters to miles: divide by 1609.34
    const miles = (visibility / 1609.34).toFixed(1);
    return `${miles} mi`;
  }
  // meters to km: divide by 1000
  const km = (visibility / 1000).toFixed(1);
  return `${km} km`;
};

/**
 * Format probability of precipitation as percentage
 * @param pop Probability 0-1
 * @returns Formatted string like "35%"
 */
export const formatPrecipitation = (pop: number): string => {
  return `${Math.round(pop * 100)}%`;
};
