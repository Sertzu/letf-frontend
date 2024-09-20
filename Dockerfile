# Stage 1: Builder - Use a slim base image for building
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including devDependencies for build
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Remix project
RUN npm run build

# Stage 2: Production - Use a smaller base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production --omit=dev

# Expose the port the app will run on
EXPOSE 3000

# Start the Remix application
CMD ["npm", "start"]
