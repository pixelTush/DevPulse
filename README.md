# DevPulse 📈

DevPulse is a modern, high-performance analytics dashboard designed to visualize real-time GitHub repository metadata and contributor activity. Built with React, TypeScript, and Vite, it leverages the GitHub REST API to provide deep insights into repository health, commit velocity, and language distribution.

## Features

- 🔍 **Repo Search**: Enter any public GitHub repository (e.g. `facebook/react`) to analyze it instantly.
- 📈 **Commit Velocity**: Interactive line charts showing commit frequency over time.
- 🔥 **File Hotspots**: Bar charts displaying the most frequently modified files to help identify complex modules or tech debt.
- 👥 **Contributor Churn**: Leaderboards breaking down the top contributors by total commits, additions, and deletions.
- 🏷️ **Language Breakdown**: Donut charts visualizing the repository's primary programming languages.
- 🔒 **Rate-Limit Bypass**: Built-in support for Personal Access Tokens (PAT) to bypass the unauthenticated 60 requests/hr limit and unlock up to 5,000 requests/hr.
- 🎨 **Glassmorphism UI**: A sleek, fully responsive dark-mode interface built with native CSS variables.

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Data Visualization**: Recharts
- **Styling**: Vanilla CSS (CSS3 Variables, Glassmorphism)
- **Data Source**: GitHub REST API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pixelTush/DevPulse.git
   ```
2. Navigate to the project directory:
   ```bash
   cd DevPulse
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5174` (or the port specified in your terminal).

## How to use a Personal Access Token (PAT)

To avoid GitHub's strict rate limits for unauthenticated API requests:
1. Go to your GitHub account Settings > Developer settings > Personal access tokens > Tokens (classic).
2. Generate a new token (no specific scopes are required for public repositories).
3. Paste the token into the top-right input field in the DevPulse dashboard.

## License
MIT
