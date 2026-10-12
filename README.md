# HAGORA Makeup Store

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-Unspecified-lightgrey)

HAGORA is a responsive beauty storefront for discovering makeup products from well-known brands. Browse the catalog, search and filter products, inspect product details, and manage a shopping cart that stays saved in the current browser.

## Features

- Makeup catalog loaded from the Makeup API
- Product browsing, search, filters, and pagination
- Product detail pages with add-to-cart actions
- Persistent shopping cart and quantity controls
- Responsive home, about, and contact pages
- Reusable React components and client-side routing

## Getting Started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
git clone https://github.com/hagarhasan/HAGORA-Makeup-Store.git
cd HAGORA-Makeup-Store
npm install
npm run dev
```

Vite prints the local development URL in the terminal after startup.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Application Routes

| Route | Page |
| --- | --- |
| `/` | Home and featured collections |
| `/products` | Product catalog |
| `/products/:id` | Product details |
| `/search` | Product search |
| `/cart` | Shopping cart |
| `/about` | About HAGORA |
| `/contact` | Contact form and information |

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Bootstrap 5
- Axios
- Font Awesome

## Project Structure

```text
src/
  Components/   Shared interface and feature components
  Context/      Shopping cart state and persistence
  Pages/        Route-level pages
  assets/       Brand and product imagery
  App.jsx       Product loading and route configuration
  main.jsx      Application entry point and global styles
```

## Deployment

The production site is published with GitHub Pages at [hagarhasan.github.io/HAGORA-Makeup-Store](https://hagarhasan.github.io/HAGORA-Makeup-Store/). Every push to `main` runs the GitHub Actions workflow, checks the code with ESLint, builds the app for the repository path, and deploys the result. The workflow also publishes a fallback page so client-side routes can be refreshed directly.

## Data and Scope

Product data is requested from the public [Makeup API](https://makeup-api.herokuapp.com/). Product loading therefore requires network access and depends on that service being available. If the service is unavailable, the storefront displays an error message instead of product results.

The cart and discount selections are stored in browser `localStorage`. This is a front-end demonstration: it does not include user accounts, a server-side order system, or payment processing.

## License

No license is currently specified. Contact the repository owner before redistributing or using this project beyond the permissions granted by the repository.