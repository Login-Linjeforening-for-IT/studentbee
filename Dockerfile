# Latest node base image
FROM node:20-alpine

# Container working directory
WORKDIR /app

# Copies package versions
COPY package*.json yarn.lock* ./

# Installs dependencies
RUN npm install

# Copies source code
COPY . .

# Builds the application
RUN npm run build

# Exposes port 3000
EXPOSE 3000

# Starts the application
CMD npm start
