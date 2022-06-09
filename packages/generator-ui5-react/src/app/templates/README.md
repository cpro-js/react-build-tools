# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It also uses [Craco (CRA Configuration Override)](https://github.com/gsoft-inc/craco) to further customize the build,
especially for UI5 integration.

## Development

### Proxy Config

Default proxy configuration for local development is configured in `.env`. You can override these settings in your own `.env.local`.

Create file `.env.local` in the root with the following config to setup username and password:

```
# override proxy settings if necessary
#REACT_APP_PROXY_URL=https://IP_AS_EXAMPLE:PORT/sap/opu/odata/
#REACT_APP_PROXY_SAP_CLIENT=300
#REACT_APP_PROXY_LOG_LEVEL=debug

# proxy credentials
REACT_APP_PROXY_SAP_USERNAME=YOUR_USER
REACT_APP_PROXY_SAP_PASSWORD=YOUR_PASSWORD
```

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy --user YOUR_USER --pwd YOUR_PASSWORD`

Uploads the app to your SAP System. Execute `npm run build` before.
