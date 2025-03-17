# Use Node.js 21 as the base image
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ../package.json ../package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ../ .

# Set environment variables from .env file
ARG REACT_APP_ECR_BASE_URL
ARG REACT_APP_BYPASS_AUTH
ENV REACT_APP_ECR_BASE_URL=$REACT_APP_ECR_BASE_URL
ENV REACT_APP_BYPASS_AUTH=$REACT_APP_BYPASS_AUTH

# Build the React application
RUN npm run build

# Use nginx to serve the built React app
FROM nginx:alpine

# Copy the build output to nginx html directory
COPY --from=0 /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
