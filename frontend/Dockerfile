# Latest node base image
FROM node:alpine

# Installs dependencies
RUN apk add --no-cache python3 make g++ varnish

# Container working directory
WORKDIR /app

# Starts varnish
COPY frontend/default.vcl /etc/varnish/default.vcl

# Copies entrypoint
COPY frontend/entrypoint.sh ./entrypoint.sh

# Copies package versions
COPY frontend/package*.json ./

# Installs dependencies
RUN npm install

# Copies source code
COPY frontend .
COPY .env .env

# Builds the application
RUN npm run build

# Exposes port 3000
EXPOSE 3000

# Starts the application
CMD ["/bin/sh", "/app/entrypoint.sh"]
