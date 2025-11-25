# Apostilas Online - Frontend

Frontend application for the Apostilas Online platform, built with React and Vite.

## Features

- User authentication (login/register)
- Material browsing and purchasing
- Secure material viewing with watermark protection
- Admin dashboard for managing materials and users
- Responsive design for all devices

## Technologies Used

- React 18
- React Router v6
- Vite
- CSS3

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3001

### Building for Production

To create a production build:

```bash
npm run build
```

### Previewing Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── components/      # Reusable UI components
├── contexts/        # React contexts
├── hooks/           # Custom hooks
├── pages/           # Page components
├── services/        # API services
├── App.css          # Main CSS file
├── App.jsx          # Main App component
└── main.jsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

The frontend application uses the following environment variables:

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Deployment

The frontend can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.