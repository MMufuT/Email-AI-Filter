# Use an official Node.js runtime as a parent image
# This shit is so wrong, fix later
FROM node:20

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your app will run on (if needed)
EXPOSE 8000

# Command to run when the container starts
CMD ["npm", "start"]