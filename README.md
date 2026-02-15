# Brewery Search (Angular)

A small Angular app for searching breweries via the Open Brewery DB API and managing a short local search history.

## Tech stack

- Angular 21 (standalone components)
- NgRx Signals store
- RxJS for debounced API requests
- Open Brewery DB API (`https://api.openbrewerydb.org/v1/`)

## Development

Install dependencies and run:

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

## How search works

- The search flow is driven by a signal store (`BrewerySearchStore`).
- Requests are debounced by **300ms**.
- Query updates are URL-encoded before being sent.
- The app starts with `per_page: 5` results.
- "See all" toggles page size between **5** and **10**.

## Search history behavior (important)

- Search history is stored in `localStorage` under key `BREWERY_SEARCH_HISTORY`.
- History max capacity is **5 items** (`historyMaxCount = 5`).
- History entries are de-duplicated by brewery `id` (latest selection wins).
- Each saved entry gets a `createdAt` timestamp and history is sorted newest-first.
- You can remove a single history item from the history list.

## Build

```bash
npm run build
```

## Test

```bash
npm test
```
