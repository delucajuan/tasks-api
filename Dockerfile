FROM node:20

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

# Start the server
CMD ["npm", "run", "dev"]
