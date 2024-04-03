# Use an official Node.js runtime as the base image
FROM node:14-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port your app runs on (if needed)
# EXPOSE 5173

# Define the command to run your application
CMD ["npm", "run", "dev"]
