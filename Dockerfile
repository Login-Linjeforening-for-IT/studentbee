# Latest node base image
FROM node:latest

# Container working directory
WORKDIR /app

# Copies package versions
COPY package*.json yarn.lock* ./

# Installs dependencies
RUN npm install --frozen-lockfile

# Copies source code
COPY . .

# Starts the application
CMD npm run build && npm run start
