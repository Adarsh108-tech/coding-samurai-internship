# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port and run server
EXPOSE 5000
CMD ["nodemon", "/src/index.js"]
