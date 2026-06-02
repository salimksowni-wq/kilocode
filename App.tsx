/**
 * Main App Component
 * Status: Production-ready
 */

import React, { useEffect } from 'react';
import { Cloud, Settings } from 'lucide-react';
import { useWeatherStore, useWeatherActions } from './weatherStore';
import { getCurrentWeather, getForecast, getWeatherByCity } from './weatherAPI';
import { getUserLocation, getDefaultLocation } from './geolocation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { Favorites } from './components/Favorites';
import { logger } from './logger';

export const App: React.FC = () => {
  const { loading, error, unit, setError, toggleUnit, loadFavoritesFromStorage } =
    useWeatherStore((state) => ({
      loading: state.loading,
      error: state.error,
      unit: state.unit,
      setError: state.setError,
      toggleUnit: state.toggleUnit,
      loadFavoritesFromStorage: state.loadFavoritesFromStorage,
    }));
  const { loadWeather } = useWeatherActions();

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('Initializing Weather Dashboard...');
        
        // Load favorites from storage
        loadFavoritesFromStorage();

        // Get user location
        const location = await getUserLocation() || getDefaultLocation();
        logger.info(`Using location: [${location.lat}, ${location.lon}]`);

        // Load weather for location
        await loadWeather(async () => {
          const weather = await getCurrentWeather(location.lat, location.lon);
          const forecast = await getForecast(location.lat, location.lon);
          
          if (!weather) {
            throw new Error('Failed to fetch weather data');
          }

          return { weather, forecast };
        });

        logger.info('App initialization complete');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initialize app';
        setError(message);
        logger.error('App initialization failed', error);
      }
    };

    initializeApp();

    // Set up auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      logger.info('Auto-refreshing weather data...');
      initializeApp();
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [loadWeather, loadFavoritesFromStorage, setError]);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Loading Spinner */}
      <LoadingSpinner visible={loading} message="Loading weather data..." />

      {/* Error Alert */}
      <ErrorAlert message={error} onClose={handleCloseError} />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Logo & Title */}
          <div className="flex items-center justify-between mb-6 sm:mb-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Cloud className="text-blue-600" size={32} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Weather Dashboard
              </h1>
            </div>

            {/* Unit Toggle Button */}
            <button
              onClick={toggleUnit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition transform hover:scale-105"
              title="Toggle temperature unit"
            >
              <Settings size={18} />
              <span className="text-sm sm:text-base">
                °{unit === 'metric' ? 'C' : 'F'}
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center w-full">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Current Weather */}
          <section>
            <CurrentWeather />
          </section>

          {/* Forecast */}
          <section>
            <Forecast />
          </section>

          {/* Favorites */}
          <section>
            <Favorites />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          <p>
            Weather data powered by{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
          <p className="mt-2">
            Auto-refreshes every 10 minutes · Last updated: <span id="lastUpdate">--:--</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
