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

# Starts the application
# CMD npm run build && npm run start
CMD npm run dev
