# eCRNow-UI

A modern web-based Electronic Case Reporting (eCR) management application built with React, TypeScript, and Vite. This application provides a user interface for configuring and managing electronic case reporting systems in healthcare settings.

## Overview

eCRNow-UI enables healthcare providers to:
- Configure Electronic Health Record (EHR) client integrations
- Manage healthcare facility settings
- Set up Knowledge Artifact Repositories (KAR)
- Configure Public Health Authority (PHA) endpoints
- Handle OAuth2/FHIR integration with various EHR systems

## Technology Stack

- **Frontend Framework:** React 18.3.1 with TypeScript 5.8.3
- **Build Tool:** Vite 7.0.5
- **UI Libraries:** React Bootstrap, Material-UI (MUI), Emotion
- **Routing:** React Router DOM 7.1.1
- **HTTP Client:** Axios 1.7.9
- **Testing:** Vitest 3.2.4 with React Testing Library
- **Styling:** Bootstrap 5.3.3, CSS-in-JS (Emotion)

## Pre-Requisites

The following technologies should be installed on your machine:

- **Node.js:** 18.0.0 or above (recommended: LTS version)
- **npm:** 9.0.0 or above
- **git:** Latest stable version

## Installation

### Clone the Repository

```bash
git clone https://github.com/drajer-health/eCRNow-UI.git
cd eCRNow-UI
```

### Install Dependencies

```bash
npm install
```

This command will download all the required dependencies specified in package.json.

## Configuration

### Environment Variables

Create a `.env` file in the project root by copying the example file:

```bash
cp .env.example .env
```

Configure the following environment variables in your `.env` file:

```env
VITE_ECR_BASE_URL=http://localhost:8081
VITE_BYPASS_AUTH=false
VITE_REFRESH_TIME=60000
```

**Environment Variables Explained:**
- `VITE_ECR_BASE_URL`: Backend API URL for the eCRNow service
- `VITE_BYPASS_AUTH`: Skip authentication for development (set to `true` only in dev)
- `VITE_REFRESH_TIME`: JWT token refresh interval in milliseconds (default: 60000ms = 1 minute)

## Available Commands

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- API proxy configured to forward `/api` requests to `http://localhost:8081`
- TypeScript type checking
- Fast refresh for React components

### Production Build

Build the application for production:

```bash
npm run build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles and optimizes all assets
- Outputs production-ready files to the `dist/` directory
- Performs tree-shaking to remove unused code

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

This serves the built application from the `dist/` directory to test the production build before deployment.

### Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode (re-runs tests on file changes):

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run coverage
```

Coverage reports will be generated in:
- Console output (text format)
- HTML report in `coverage/` directory

## Project Structure

```
eCRNow-UI/
├── src/
│   ├── App.tsx                      # Main app router and authentication
│   ├── main.tsx                     # Application entry point
│   ├── setupTests.ts                # Test configuration
│   ├── Components/                  # Page components
│   │   ├── Authorizations/          # OAuth2 authorization handling
│   │   ├── ClientDetails/           # EHR client configuration
│   │   ├── HealthCareSettings/      # Healthcare settings management
│   │   ├── KAR/                     # Knowledge Artifact Repositories
│   │   ├── LoginPage/               # User authentication
│   │   ├── PublicHealthAuthority/   # PHA endpoint configuration
│   │   └── ...
│   ├── Models/                      # TypeScript interfaces and types
│   ├── ReUsables/                   # Shared form components
│   ├── Services/                    # API services and HTTP client
│   │   └── AxiosConfig.ts           # Axios instance with JWT handling
│   ├── Shared/                      # Layout components
│   │   ├── Header/
│   │   └── HeaderMenu/
│   └── index.css                    # Global styles
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
└── .env.example                     # Environment variables template
```

## Key Features

### Authentication & Authorization
- JWT-based authentication with automatic token refresh
- OAuth2 authorization flows with FHIR servers
- Secure session management with cookie-based tokens

### Client Details Management
- Configure EHR client integrations
- Support for multiple launch types (Provider, System, User Account)
- FHIR server URL configuration

### Healthcare Settings
- FHIR configuration (auth types, scopes, endpoints)
- Transport configuration (Direct, XDR, REST API)
- Application settings (encounter thresholds, debug logging)
- Organization defaults
- Response options and document reference handling

### Knowledge Artifact Repositories
- Search and register FHIR-based KAR repositories
- Support for multiple output formats (CDA_R11, CDA_R30, CDA_R31, FHIR)

### Public Health Authority Management
- Configure PHA endpoints for case reporting
- Manage multiple PHA configurations

## Vite Configuration

The project uses Vite for fast development and optimized builds. Key configuration features:

- **Path Alias:** `@` resolves to `src/` directory for cleaner imports
- **API Proxy:** Development server proxies `/api` requests to backend
- **React Fast Refresh:** Instant component updates during development
- **Vitest Integration:** Test configuration with jsdom environment

## Backend Integration

The application communicates with the eCRNow backend service (default: `http://localhost:8081`).

Ensure the backend service is running before starting the frontend application.

## Browser Support

Modern browsers with ES6+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is part of the eCRNow system for Electronic Case Reporting.

## Support

For issues and questions, please refer to the project documentation or contact the development team.