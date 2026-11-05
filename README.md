# Frame — TV Shows Dashboard

A responsive TV discovery dashboard built for the supplied frontend assignment using Vue 3, TypeScript, Composition API, Pinia and the TVMaze public API.

## Features

- Browse TV shows grouped into genre-based horizontal rails.
- Shows within each genre are sorted by rating (highest first); unrated shows appear last.
- Featured highest-rated shows on the home screen.
- Search shows by title using TVMaze search.
- Show detail route with summary, rating, genres, network, official website and cast when available.
- Loading, empty and error states.
- Responsive desktop, tablet and mobile layouts.
- Semantic landmarks, labelled search controls, keyboard-visible focus, descriptive image alternatives and reduced-motion support.
- Structured Vitest unit/component tests for API services, Pinia state, composables, search cancellation, carousels, episode filtering, utilities and reusable components.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Quality checks

```bash
npm test
npm run build
```

## Architecture

- `src/services/tvmaze.service.ts`: isolated HTTP/API layer. It checks HTTP status and encodes search input.
- `src/stores/shows.store.ts`: Pinia store for catalogue, details, cast, search and request states.
- `src/utils/show.utils.ts`: pure functions for rating sort, genre grouping and summary cleanup.
- `src/components`: reusable layout, feedback and show components.
- `src/views`: route-level pages.
- `src/router`: Vue Router configuration.
- `src/types`: shared API-facing TypeScript types.

The assignment notes that TVMaze does not provide a dedicated genre endpoint. The dashboard therefore loads the Show Index (`/shows?page=0`) and groups the returned shows by their `genres` field in the frontend. The search and detail pages use `/search/shows`, `/shows/:id`, and `/shows/:id/cast` respectively.

## API and limitations

Data is fetched live from [TVMaze](https://www.tvmaze.com/api). An internet connection is required. TVMaze's Show Index is paginated; this implementation loads page 0 for the initial dashboard to keep the first request bounded. The dashboard displays all genres present in that page. Search and detail requests are made on demand. API availability and rate limits are controlled by TVMaze.

TVMaze show summaries contain HTML. The app strips tags before displaying the summary as plain text. Ratings can be absent; those shows display `NR` and sort after rated shows.

## Browser support

Targets modern evergreen browsers with native `fetch`, ES2022 and CSS Grid/Flexbox support.

## Featured hero carousel

The home page includes a responsive featured-show hero carousel. It selects the four highest-rated shows from the loaded TVMaze catalogue, rotates every five seconds, and exposes four accessible pagination dots for direct slide selection. Autoplay pauses while the carousel is hovered or focused and respects the user's reduced-motion preference. Selecting **View details** navigates to the selected show's details route.

## Episode guide and search improvements

- Show details loads the full episode list from `GET /shows/:id/episodes` and presents it in a horizontal carousel grouped by season. The season selector filters the episodes; arrow controls scroll the selected season. Episodes are sorted by season and episode number. TVMaze excludes specials from this endpoint unless `?specials=1` is requested.
- The header search control navigates to `/search`. The search page calls `GET /search/shows?q=...` after a 350 ms debounce using the `useDebounce` composable.
- Each search request uses an `AbortController`. A newer query aborts the previous request, and the active request alone can update the displayed results. The request is also aborted when the search page is unmounted.
- Search supports loading, error, empty-result and clear-search states. Search terms are reflected in the URL query string.
- TVMaze attribution is included in the episode guide. API reference: https://www.tvmaze.com/api

## Testing

The project uses **Vitest** with **Vue Test Utils** and a `jsdom` environment.

```bash
# Run the full unit-test suite once
npm test

# Run tests in watch mode while developing
npm run test:watch

# Generate a V8 coverage report (text + HTML)
npm run test:coverage
```

The test suite covers TVMaze API request construction and failures, show utilities,
Pinia store actions and state, the debounce composable and cleanup, search debounce
and request cancellation, the featured carousel controls/autoplay, episode loading,
season filtering and empty/error states, and show-card rendering/navigation.

Tests mock network requests; they do not depend on the live TVMaze API.
