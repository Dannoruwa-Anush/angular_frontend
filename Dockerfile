# -------------------------------
# Stage 1: Build Angular app
# -------------------------------
FROM node:22-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies (reproducible installs)
RUN npm ci

# Copy application source code
COPY . .

# Build Angular application for production
RUN npm run build -- --configuration production

# -------------------------------
# Stage 2: Serve with Nginx
# -------------------------------
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config (supports Angular routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled Angular production build from the build stage
# into Nginx web root so it can be served as static files
COPY --from=build /app/dist/my-angular-app /usr/share/nginx/html

# Expose internal Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]