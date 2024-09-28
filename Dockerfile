FROM node:bookworm-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

ENV NODE_ENV=development

# Start the server and run migrations when the container starts
CMD ["sh", "-c", "npm run migration:run && npm run dev"]
