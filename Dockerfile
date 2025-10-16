# Step 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY ./src ./src
COPY ./public ./public

RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine as production

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Replace default Nginx config (recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]