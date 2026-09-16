# Skytec Industries - Premium Electric Fans

Manufacturer, wholesaler, and retailer of premium electric fans including ceiling, wall mount, table, and pedestal fans.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

The application will be available at http://localhost:3000

## Build for Production

1. Build the application:
   `npm run build`
2. Start the production server:
   `npm start`

## Deploy to Google Cloud Run

1. Build the application with `npm run build`.
2. Deploy from the Google Cloud Console or CLI, setting `NODE_ENV=production` and `ADMIN_INITIAL_PASSWORD` as runtime environment variables.
3. Use the Cloud Run HTTPS URL. Cloud Run supplies the `PORT` variable automatically.

The local JSON database is suitable for development only. For production, use a persistent database or mounted storage because Cloud Run instances can be replaced.
