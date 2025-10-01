# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**OZI Interactive Demo** - A standalone vanilla JavaScript sleep tracking app UI demo simulating an iOS mobile interface for the OZI sleep device.

## Technology Stack
- Pure vanilla JavaScript (no frameworks)
- Tailwind CSS + Font Awesome (CDN)
- Static frontend only - no backend

## File Structure
```
.
├── index.html              # All screens and app structure
├── script.js               # App logic (~95KB)
├── styles.css              # Main styles (~90KB)
├── sleep-coach-styles.css  # Sleep coach styles
├── music-player.css        # Music player styles
├── music-player.js         # Music player logic
└── generate-story-audio.js # AI story audio generator (gitignored)
```

## Architecture

**SPA Design**: All 13 screens are hidden divs (`.app-screen`) in `index.html`. Navigation via `showScreen(screenId)`.

**Screens**: home, sleep-details, ai-chat, music, shop, white-noise, nature-sounds, ambient-noise, mechanical-sounds, urban-ambience, settings, metric-detail, profile

**Navigation**:
- 4 bottom tabs: Home, AI Chat, Music, Shop
- Header icons: Settings, Profile
- Back buttons: `navigateBack()`
- `navigationHistory` array tracks screen stack

**State** (script.js global vars):
- `currentScreen`, `selectedPeriod`, `currentDate`
- `sleepDataFromFile` (line 55+) - hardcoded sleep metrics by date
- `homepageDate = July 29, 2024` - fixed "today"
- Device controls: volume, fan, brightness, light color

**UI Structure**:
- `.phone-bezel` → `.phone-frame` → `.app-content` + `.phone-navigation`

## Development

**Running**: Open `index.html` in browser or use `python -m http.server 8000`

**Cache Busting**: Increment version numbers in index.html:
```html
<link rel="stylesheet" href="styles.css?v=2.4">
<script src="script.js?v=2.4"></script>
```

**Adding a Screen**:
1. Add `<div id="new-screen" class="app-screen">` to index.html
2. Add entry to `screenDescriptions` object (script.js line 316)
3. Wire back button: `document.getElementById('new-screen-back-btn')?.addEventListener('click', navigateBack)`
4. Add styles

**Sleep Data**: Edit `sleepDataFromFile` (script.js line 55+). Date keys contain: score, startTime, endTime, duration, heartRate, interruptions, timeToSleep, timeToWake, movementScore, stages (awake/rem/light/deep %)

**Device Controls**: Use `data-metric` attribute on `.control-slider` and `.control-value` elements

**Toggles**: `.modern-toggle-container` with `data-control` attribute, toggle on/off classes

## Key Functions

- `showScreen(screenId)` - Switch screens, updates history
- `navigateBack()` - Return to previous screen
- `formatDateDisplay(date)` - Format dates consistently
- All event listeners in `DOMContentLoaded` callback

## Important

- **Static Demo**: No backend, API calls, or persistence. All data hardcoded.
- **AI Chat**: Uses TTS (speechSynthesis API) for story narration
- **Gitignored**: `generate-story-audio.js`, `server.log`