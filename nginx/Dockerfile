# Use the official Nginx image as the base image
FROM --platform=linux/amd64 nginx:latest

# Copy your Nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which Nginx will listen (typically 80)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
