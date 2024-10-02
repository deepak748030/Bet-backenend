# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (change if your app runs on a different port)
EXPOSE 3000

# Command to run your application using nodemon (ensure nodemon is installed)
CMD ["npx", "nodemon", "index.js"]
