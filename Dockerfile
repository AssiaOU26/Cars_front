# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and build
RUN npm install && npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
