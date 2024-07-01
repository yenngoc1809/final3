# Use an official Node runtime as a parent image
FROM node:20-alpine3.18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run app when the container launches
CMD npm start