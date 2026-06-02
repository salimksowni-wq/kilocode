/**
 * Weather API Types & Interfaces
 * OpenWeatherMap API Response Models
 * Status: Production-ready
 */

export type TemperatureUnit = 'metric' | 'imperial';

// ===== OpenWeatherMap API Response Types =====

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface SystemInfo {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: MainWeatherInfo;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: SystemInfo;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherInfo;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

// ===== Application Types =====

export interface AppWeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  weather: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  visibility: number;
  timestamp: number;
}

export interface AppForecastDay {
  date: string;
  day: string;
  temp_min: number;
  temp_max: number;
  temp_avg: number;
  weather: string;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  pop: number;
  timestamp: number;
}

export interface StorageData {
  favorites: string[];
  lastUnit: TemperatureUnit;
}

export interface GeoLocationData {
  lat: number;
  lon: number;
  accuracy: number;
}

export interface WeatherStoreState {
  // Data
  currentWeather: AppWeatherData | null;
  forecast: AppForecastDay[];
  favorites: string[];

  // UI State
  loading: boolean;
  error: string | null;
  unit: TemperatureUnit;

  // Actions
  setCurrentWeather: (weather: AppWeatherData | null) => void;
  setForecast: (forecast: AppForecastDay[]) => void;
  addFavorite: (cityName: string) => void;
  removeFavorite: (cityName: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleUnit: () => void;
  loadFavoritesFromStorage: () => void;
  saveFavoritesToStorage: () => void;
}
