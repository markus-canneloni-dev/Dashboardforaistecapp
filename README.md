# Gepatschferner Lake Dashboard

A GLOF (Glacier Lake Outburst Flood) monitoring dashboard built with React, TypeScript, and Tailwind CSS.

## Quick Start

1. **Install dependencies**
```bash
pnpm install
```

2. **Run development server**
```bash
pnpm dev
```

3. **Build for production**
```bash
pnpm build
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Main application
│   ├── components/
│   │   └── glacier/           # Dashboard components
│   │       ├── TitleBar.tsx
│   │       ├── Taskbar.tsx
│   │       ├── Header.tsx
│   │       ├── KPICard.tsx
│   │       ├── MapPanel.tsx
│   │       ├── DropdownSection.tsx
│   │       ├── InfrastructureDropdown.tsx
│   │       └── ContributingMapsDropdown.tsx
│   └── services/
│       └── lakeDataService.ts  # Backend integration examples
└── styles/
    ├── fonts.css
    ├── tailwind.css
    └── theme.css               # Light theme colors

```

## Features

- ✨ Light, minimal design
- 📊 Real-time lake monitoring metrics
- 🗺️ Interactive map with temporal views (1 year before/current/1 year after)
- 📈 Risk scoring and GLOF probability
- 🏘️ Downstream infrastructure tracking
- 🛰️ Contributing satellite data maps

## Backend Integration

Currently uses mock data. See `BACKEND_INTEGRATION.md` for:
- Supabase setup
- Custom API examples (Node.js/Python)
- Database schema
- How to replace mock data with real API calls

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **pnpm** - Package manager

## Key Components

### MapPanel
Shows lake boundary with temporal views (2023, 2024, 2025 projected)

### KPICards
Display key metrics: Risk Score, Lake Area, GLOF Probability

### DropdownSection
Collapsible sections for Infrastructure and Contributing Maps

## Customization

### Colors
Edit `src/styles/theme.css` to change the color scheme

### Lake Data
Replace mock data in `src/app/services/lakeDataService.ts`

## License

MIT
