# Apostilas Online - Backend

Backend API for the Apostilas Online platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Material management (CRUD operations)
- Purchase system with Stripe integration
- Content protection with image conversion and watermarking
- Admin dashboard APIs
- Comprehensive logging and audit trails
- API documentation with Swagger

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Sharp.js for image processing
- PDF-Poppler for PDF conversion
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Update the `.env` file with your configuration

### Development

To start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:3000

### Production

To start the production server:

```bash
npm start
```

## API Documentation

API documentation is available through Swagger UI at:
http://localhost:3000/api-docs

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── app.js           # Express app
└── server.js        # Server entry point
```

## Environment Variables

The backend application requires the following environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_REFRESH_SECRET` - Secret for refresh token signing
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## Database Models

- **User** - User accounts with roles and owned materials
- **Material** - Study materials with PDF files and metadata
- **Purchase** - Purchase records linking users and materials
- **Log** - Audit logs for system actions

## Authentication

The API uses JWT tokens for authentication:

1. Register or login to get access and refresh tokens
2. Include the access token in the Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
3. Refresh tokens can be used to get new access tokens

## Stripe Integration

The platform uses Stripe for payment processing:

1. Create a Stripe account
2. Get your API keys
3. Add them to your `.env` file
4. Configure webhooks in the Stripe dashboard

## Content Protection

Materials are protected through:

1. PDF to image conversion
2. Dynamic watermarking with user information
3. Access control based on purchases
4. Prevention of direct file downloads

## Logging

All important actions are logged including:

- User views
- Access denied attempts
- Purchases
- Administrative actions

## Testing

To run tests:

```bash
npm test
```

## Deployment

The backend can be deployed to any Node.js hosting service like:

- Railway
- Render
- Heroku
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.