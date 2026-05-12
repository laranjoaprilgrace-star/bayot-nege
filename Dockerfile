# Use Node.js as base
FROM node:20-slim

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install && apt-get update && apt-get install -y php && rm -rf /var/lib/apt/lists/*

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Expose ports (Vite default 5173, Backend 3001, PHP 3005)
EXPOSE 5173 3001 3005

# Command to run the full stack
CMD ["npm", "run", "dev:full"]
