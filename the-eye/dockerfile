# Build stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 4173

CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0" ]