# Housing Market Dashboard

A modern, responsive housing market dashboard built with React and Tailwind CSS, providing real-time analytics and insights for the Greater Toronto Area housing market.

![Housing Dashboard](https://img.shields.io/badge/React-18.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-teal) ![Recharts](https://img.shields.io/badge/Recharts-2.0-orange)

## Features

- **Real-time Market Data**: Track housing prices, sales volumes, and inventory levels
- **Interactive Charts**: Visualize market trends with beautiful, responsive charts
- **Regional Analysis**: Compare data across Peel Region, Mississauga, Brampton, and Caledon
- **Housing Type Filters**: Analyze specific property types (Detached, Semi-Detached, Townhouse, Condo)
- **Key Performance Indicators**: Monitor important metrics like average price, sales volume, days on market, and inventory
- **Market Insights**: Get actionable insights and recommendations based on current market conditions
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS 3.0
- **Charts**: Recharts
- **Build Tool**: Create React App
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/housing-dashboard.git
cd housing-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
housing-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── Dashboard.js
│   │   ├── KeyMetrics.js
│   │   └── charts/
│   │       ├── PriceChart.js
│   │       ├── SalesChart.js
│   │       └── InventoryChart.js
│   ├── data/
│   │   └── housingData.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Deployment

To build for production:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Data visualization powered by [Recharts](https://recharts.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Built with [Create React App](https://create-react-app.dev/)
