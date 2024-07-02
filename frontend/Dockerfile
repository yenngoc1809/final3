
FROM node:20-alpine3.18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install any needed packages
RUN npm install --legacy-peer-deps

# Copy the current directory contents into the container at /app
COPY . .

# Set environment variable to use legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "run", "dev"]
