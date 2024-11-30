
# Use the official Node.js image as the base image
FROM node:20-alpine

ENV DB=/db
# Set the working directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY server.js .env.backend ./

# Install dependencies

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]
