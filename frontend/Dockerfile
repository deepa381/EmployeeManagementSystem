# Use official Node.js LTS image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and lock (if any)
COPY package.json .

# Install dependencies
RUN npm install --silent

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000 (nginx default 80, map to 3000 via compose)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
