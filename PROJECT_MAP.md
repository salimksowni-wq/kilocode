# 🌤️ WEATHER DASHBOARD - PROJECT MAP

**Date Created:** June 2, 2026  
**Status:** 🟢 ACTIVE EXECUTION  
**Last Updated:** 2026-06-02

---

## [TECH_STACK]

### Core Framework
- **React:** 19.0.0 (LTS - Stable)
- **TypeScript:** 5.5.0 (Latest stable)
- **Vite:** 5.2.0 (Build tool - Fast)

### State Management
- **Zustand:** 4.5.0 (Lightweight, no boilerplate)

### HTTP & API
- **Axios:** 1.7.0 (HTTP client)
- **OpenWeatherMap API:** Free tier (current + 5-day forecast)

### UI & Styling
- **TailwindCSS:** 3.4.0 (Utility-first CSS)
- **Lucide React:** 0.394.0 (SVG icons)

### Dev Tools
- **TypeScript Compiler:** 5.5.0
- **PostCSS:** 8.4.0
- **Autoprefixer:** 10.4.0

---

## [SYSTEM_FLOW]

### 1️⃣ Initialization Flow
```
App Start
  ├─ Check localStorage for favorite cities
  ├─ Request geolocation (user permission)
  ├─ fetchCurrentWeather(lat, lon)
  ├─ Store in Zustand (weatherStore)
  └─ Render CurrentWeather component
```

### 2️⃣ Current Weather Display
```
CurrentWeather Component
  ├─ Input: location data from store
  ├─ Display: 
  │   ├─ City name + Country
  │   ├─ Current temperature (°C/°F toggle)
  │   ├─ Weather icon + description
  │   ├─ Humidity, Wind speed, Pressure
  │   └─ Sunrise/Sunset times
  └─ Auto-refresh every 10 minutes
```

### 3️⃣ Search & Autocomplete Flow
```
SearchBar Component
  ├─ User types city name
  ├─ Debounce: 300ms
  ├─ searchCity(query) via API
  ├─ Show dropdown suggestions
  ├─ On select: fetchCurrentWeather() + fetchForecast()
  └─ Update store + localStorage
```

### 4️⃣ Forecast Display
```
Forecast Component
  ├─ Input: 5-day forecast data
  ├─ Display: Horizontal scroll cards
  │   ├─ Date
  │   ├─ Weather icon
  │   ├─ Min/Max temperature
  │   └─ Clickable for details
  └─ On click: Show day details modal
```

### 5️⃣ Favorites Management
```
Favorites Component
  ├─ Display saved cities as pills
  ├─ On click: Load weather for that city
  ├─ Show X button to remove
  ├─ Add button to favorites from CurrentWeather
  └─ Persist in localStorage (max 10 cities)
```

---

## [ARCHITECTURE]

```
src/
├── components/
│   ├── CurrentWeather.tsx
│   │   └─ Props: None (reads from store)
│   │   └─ State: temperature unit toggle
│   │   └─ Logs: fetchCurrentWeather start/end
│   │
│   ├── Forecast.tsx
│   │   └─ Props: None (reads from store)
│   │   └─ Renders: 5 day cards
│   │   └─ Logs: forecast load status
│   │
│   ├── SearchBar.tsx
│   │   └─ Props: onCitySelect callback
│   │   └─ State: search input + debounce
│   │   └─ Logs: search queries
│   │
│   ├── Favorites.tsx
│   │   └─ Props: None (reads/writes to store)
│   │   └─ Renders: Favorite city pills
│   │   └─ Logs: add/remove favorites
│   │
│   ├── LoadingSpinner.tsx
│   │   └─ Props: visible boolean
│   │   └─ Simple animated spinner
│   │
│   └── ErrorAlert.tsx
│       └─ Props: error message, onClose
│       └─ Shows error toast
│
├── services/
│   ├── weatherAPI.ts
│   │   ├─ getCurrentWeather(lat, lon) → WeatherData
│   │   ├─ getForecast(lat, lon) → ForecastData[]
│   │   ├─ searchCity(query) → CityOption[]
│   │   └─ All with error handling + logging
│   │
│   ├── geolocation.ts
│   │   ├─ getLocation() → { lat, lon }
│   │   └─ Handle denied permission gracefully
│   │
│   └── storage.ts
│       ├─ saveFavorites(cities)
│       ├─ getFavorites() → string[]
│       └─ clearFavorites()
│
├── store/
│   └── weatherStore.ts (Zustand)
│       ├─ State:
│       │   ├─ currentWeather: WeatherData | null
│       │   ├─ forecast: ForecastData[]
│       │   ├─ favorites: string[]
│       │   ├─ loading: boolean
│       │   ├─ error: string | null
│       │   └─ unit: 'metric' | 'imperial'
│       │
│       ├─ Actions:
│       │   ├─ setCurrentWeather(data)
│       │   ├─ setForecast(data)
│       │   ├─ setLoading(bool)
│       │   ├─ setError(msg)
│       │   ├─ addFavorite(city)
│       │   ├─ removeFavorite(city)
│       │   └─ toggleUnit()
│
├── types/
│   └── weather.ts
│       ├─ WeatherData interface
│       ├─ ForecastData interface
│       ├─ CityOption interface
│       └─ APIResponse types
│
├── utils/
│   ├── formatters.ts
│   │   ├─ formatTemp(celsius) → string
│   │   ├─ formatDate(timestamp) → string
│   │   ├─ formatWindSpeed(ms) → string
│   │   └─ getWeatherIcon(code) → string
│   │
│   └── logger.ts
│       ├─ logger.info(msg, data?)
│       ├─ logger.warn(msg, data?)
│       ├─ logger.error(msg, error?)
│       └─ All async, non-blocking
│
├── App.tsx (Root)
│   └─ Renders: SearchBar, CurrentWeather, Forecast, Favorites
│   └─ Layout: Header + Main grid
│
├── main.tsx
│   └─ React render to #root
│
├── index.css
│   └─ Tailwind config + custom utilities
│
└── vite-env.d.ts
    └─ Vite type definitions

SHARED LOGIC:
─────────────
✓ API calls → services/weatherAPI.ts
✓ State mutations → store/weatherStore.ts
✓ Formatting → utils/formatters.ts
✓ Logging → utils/logger.ts

NO MICRO-FILES: Each file has clear responsibility
DRY PRINCIPLE: Reusable functions in utils/
```

---

## [ORPHANS & PENDING]

### Current: NONE ✅

### Completed Milestones:
- ✅ M0: Planning phase complete
- ✅ Planning approved by user

### Next Milestones:
- [ ] M1: Setup project structure + types
- [ ] M1: Implement weatherAPI service
- [ ] M1: Create CurrentWeather component
- [ ] M1: Create SearchBar component
- [ ] M2: Create Forecast component
- [ ] M2: Create Favorites system
- [ ] M2: Setup Zustand store
- [ ] M3: Make responsive (Mobile first)
- [ ] M3: Add error boundaries
- [ ] M3: Theme toggle (light/dark)
- [ ] M4: Production build
- [ ] M4: Deployment

---

## [VERIFIABLE SUCCESS CRITERIA]

| Feature | Success Criterion | Status |
|---------|------------------|--------|
| Current weather | Shows temp, icon, description within 2s | ⏳ |
| Search autocomplete | Returns results in <500ms, no lag | ⏳ |
| Forecast display | All 5 days visible, smooth scroll | ⏳ |
| Favorites | Persist across page reloads | ⏳ |
| Responsive | Works on iPhone 12 + Desktop | ⏳ |
| Error handling | User sees friendly message, no console errors | ⏳ |
| Auto-refresh | Updates every 10 minutes silently | ⏳ |

---

## [TECH DEBT & KNOWN ISSUES]

### Current: NONE

---

**Next Step:** Execute M1 Phase
