# Use an official Node.js runtime as the base image
FROM  --platform=linux/amd64 node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3010

# Define the command to run your application
CMD ["node", "index.js"]
