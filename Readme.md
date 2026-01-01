# studentbee
Website to practice for exams written in Nextjs, TypeScript and Tailwind.
This website is a complete implementation of a card based learning website with all functionality implemented.
In theory this website could be put in production and work out of the box.

## Building
To start the frontend run `docker compose up --build`. This will start the website on port 3000, and the api on port 8080.

## Secrets

#### User Interface
`BASE_URL` - URL to the location hosting the user interface
`API_URL` - Server side URL to the location hosting the API
`NEXT_PUBLIC_BROWSER_API_URL` - Client side URL to the location hosting the API


#### API
`DB_PASSWORD` - Strong password used to protect the database
`AUTHENTIK_URL` - Base Authentik path
`CLIENT_ID` - Authentik provider client ID
`CLIENT_SECRET` - Authentik provider client secret
`REDIRECT_URI` - Auth redirect URI
`DB_HOST` - Host serving the database
