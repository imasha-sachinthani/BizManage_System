# BizManage Docker Setup

This project uses Docker Compose to containerize the application for easy development and deployment.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd BizManage
```

2. Build and start the services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:5173

## Available Commands

### Development
```bash
# Start all services in development mode
docker-compose up

# Start services in background
docker-compose up -d

# Build and start services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend
```

### Production
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build
```

## Services

### Frontend
- **Port**: 5173
- **Framework**: React + Vite
- **Hot Reload**: Enabled in development mode

### Backend (Coming Soon)
- **Port**: 3001
- **Framework**: Node.js/Express (or your preferred backend)

### Database (Coming Soon)
- **Port**: 5432
- **Type**: PostgreSQL
- **Data**: Persisted in Docker volume

## Adding Backend Services

To add backend services, uncomment the relevant sections in `docker-compose.yml` and create the corresponding Dockerfile in your backend directory.

## Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@db:5432/bizmanage
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in `docker-compose.yml`
2. **Permission errors**: Ensure Docker has proper permissions
3. **Hot reload not working**: Make sure volumes are properly mounted

### Clean Up

```bash
# Remove all containers, networks, and volumes
docker-compose down -v --remove-orphans

# Remove all Docker images
docker system prune -a
```