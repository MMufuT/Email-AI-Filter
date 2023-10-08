# Use an official Node.js runtime as a parent image
FROM --platform=linux/amd64 node:20-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your app will run on (if needed)
EXPOSE 3000

# Command to run when the container starts
CMD ["npm", "start"]