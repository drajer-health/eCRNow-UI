# React App with Docker Compose

This guide explains how to build and run a React application using **Docker Compose**, passing environment variables at build time.

## Prerequisites

Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Dockerfile

Ensure your **Dockerfile** correctly sets up the React app and passes build arguments:

```dockerfile
# Use Node.js image for building the app
FROM node:20 AS build

# Set build arguments
ARG REACT_APP_ECR_BASE_URL
ARG REACT_APP_BYPASS_AUTH

# Set environment variables
ENV REACT_APP_ECR_BASE_URL=$REACT_APP_ECR_BASE_URL
ENV REACT_APP_BYPASS_AUTH=$REACT_APP_BYPASS_AUTH

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## docker-compose.yml

Your **docker-compose.yml** file should define the service and pass build arguments:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        REACT_APP_ECR_BASE_URL: "http://localhost:8081"
        REACT_APP_BYPASS_AUTH: "false"
    ports:
      - "80:80"
```

## Build & Run

### 1. Build the Docker Image (without cache)

Run the following command to build the React app and pass the environment variables:

```sh
docker compose build --no-cache \
  --build-arg REACT_APP_ECR_BASE_URL=http://localhost:8081 \
  --build-arg REACT_APP_BYPASS_AUTH=false
```

### 2. Start the Container

Once built, start the container using:

```sh
docker compose up -d
```

### 3. Verify Environment Variables

To check if the environment variables were set correctly inside the container, run:

```sh
docker run --rm <your-react-container> printenv | grep REACT_APP
```

You should see:
```
REACT_APP_ECR_BASE_URL=http://localhost:8081
REACT_APP_BYPASS_AUTH=false
```

### 4. Access the App

The React app should now be running at:

```
http://localhost
```

## Troubleshooting

- If environment variables are not reflecting, try clearing the cache and rebuilding:
  ```sh
  docker system prune -a
  docker compose build --no-cache
  ```
- Ensure your React app accesses environment variables via `process.env.REACT_APP_ECR_BASE_URL`.

---


