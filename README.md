# Apostilas Online

Uma plataforma completa para venda e visualização segura de materiais de estudo digitais. Este projeto inclui uma API backend e uma aplicação web frontend.

> 🔧 **IMPORTANTE:** Se você está tendo problemas com login/registro, veja o arquivo [CORRECOES.md](./CORRECOES.md) para instruções detalhadas.

## Project Overview

Apostilas Online is a web platform that allows users to purchase and view digital study materials (apostilas) in a secure environment. The platform prevents unauthorized copying and downloading of materials through content protection mechanisms.

## Features

### User Features
- User registration and authentication
- Browse available study materials
- Purchase materials with secure payment processing
- View purchased materials with watermark protection
- Personal dashboard to manage purchases

### Admin Features
- Manage study materials (create, update, delete)
- User management (activate/deactivate accounts)
- View system logs and audit trails
- Monitor sales and platform activity

### Technical Features
- JWT-based authentication with refresh tokens
- PDF to image conversion for content protection
- Dynamic watermarking with user information
- Stripe payment integration
- RESTful API with Swagger documentation
- Responsive web interface
- MongoDB for data storage

## Project Structure

```
apo/
├── backend/         # Node.js Express backend API
├── frontend/        # React frontend application
└── specs-apo/       # Project specifications and documentation
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Sharp.js for image processing
- PDF-Poppler for PDF conversion
- Swagger for API documentation

### Frontend
- React 18
- React Router v6
- Vite
- CSS3

## 🚀 Início Rápido

### Pré-requisitos
- Node.js (v16 ou superior)
- MongoDB (local ou Atlas) - **[Ver guia de instalação](./INSTALACAO_MONGODB.md)**
- npm ou yarn

> ⚠️ **IMPORTANTE:** Se o backend não iniciar, provavelmente você precisa configurar o MongoDB. Veja [INSTALACAO_MONGODB.md](./INSTALACAO_MONGODB.md)

### Configuração do Backend

1. Navegue até o diretório backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   copy .env.example .env
   ```
4. Atualize o arquivo `.env` com suas configurações
5. Inicialize o banco de dados com usuários de teste:
   ```bash
   npm run seed
   ```
   Isso criará:
   - Admin: admin@apostilas.com / admin123
   - Usuário: usuario@teste.com / teste123

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Configuração do Frontend

1. Navegue até o diretório frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Ou Use o Script Automático

Execute o arquivo `start-dev.bat` na raiz do projeto para iniciar backend e frontend automaticamente.

## Development Workflow

1. Start the backend server (port 3000)
2. Start the frontend development server (port 3001)
3. Access the application at http://localhost:3001

## API Documentation

Backend API documentation is available through Swagger UI at:
http://localhost:3000/api-docs

## Deployment

### Backend
The backend can be deployed to any Node.js hosting service like:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

### Frontend
The frontend can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages

## Security Features

1. **Content Protection**: PDF files are converted to images and watermarked with user information
2. **Access Control**: Users can only view materials they have purchased
3. **Authentication**: JWT tokens with refresh token mechanism
4. **Payment Security**: Stripe integration for secure payment processing
5. **Data Protection**: Password hashing and secure storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.