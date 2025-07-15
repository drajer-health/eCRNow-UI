# --- Build Stage: Install deps and build static assets ---
FROM node:20 AS build

WORKDIR /app

# Copy only package definition first for Docker caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy all other sources
COPY . .

# Build-time environment variables (adapt or add more as needed)
ARG REACT_APP_ECR_BASE_URL
ARG REACT_APP_BYPASS_AUTH
ENV REACT_APP_ECR_BASE_URL=$REACT_APP_ECR_BASE_URL
ENV REACT_APP_BYPASS_AUTH=$REACT_APP_BYPASS_AUTH

# Build the static site
RUN npm run build

# --- Production Stage: Static file serving with NGINX ---
FROM nginx:alpine

# Copy built static assets from builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed; otherwise, remove this line
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose default HTTP port
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
