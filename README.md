# PaintForge

PaintForge is a React application for managing, browsing, and comparing miniature paint collections, with a focus on Citadel and other popular hobby paint brands.

## Features

- Browse a comprehensive paint library with filtering and search
- View detailed information for each paint, including color swatches and codes
- Mark paints as owned or favorite, with persistent storage
- Compare similar colors and explore recipes
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/PaintForge.git
    cd PaintForge
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Start the development server:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/`
  - `components/` – Reusable UI components (PaintCard, SideMenu, etc.)
  - `data/` – Paint data files (e.g., CitadelColors.js)
  - `pages/` – Main pages (PaintDashboard, PaintDetails, etc.)
  - `context/` – React context for user paint lists
  - `utils/` – Utility functions (color manipulation, etc.)
  - `App.jsx` – Main app component and routing
  - `main.jsx` – Entry point

## Customization

- To add or update paint data, edit files in `src/data/`.
- To add new brands or features, create new data files and update components as needed.

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (for styling)
- [Lucide React](https://lucide.dev/) (icons)
- [React Router](https://reactrouter.com/)

## License

This project is licensed under the MIT License.

---
