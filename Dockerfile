# Latest node base image
FROM node:20-alpine

# Installs Python
RUN apk add --no-cache python3 make g++ varnish

# Container working directory
WORKDIR /app

# Starts varnish
COPY default.vcl /etc/varnish/default.vcl

# Copies entrypoint
COPY entrypoint.sh ./entrypoint.sh

# Copies package versions
COPY package*.json ./

# Installs dependencies
RUN npm install
RUN npm install fastify @fastify/cors dotenv firebase-admin

# Copies source code
COPY . .

# Builds the application
RUN npm run build

# Exposes port 3000
EXPOSE 3000

# Starts the application
CMD ["/bin/sh", "/app/entrypoint.sh"]
