# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It also uses [Craco (CRA Configuration Override)](https://github.com/gsoft-inc/craco) to further customize the build,
in order to realize the Fiori Launchpad integration.

## Configuration

### Launchpad

The launchpad integration is configured in the file `ui5.config.ts`, which is used in development mode
and to generate the final manifest file needed for deployment.

To use the local launchpad sandbox in development,
point your browser to [http://localhost:3000/launchpad.html](http://localhost:3000/launchpad.html)

### Proxy

When developing we use a proxy to simulate that requests for our frontend stuff
(served by a local node.js server) and web service / OData calls (served by a SAP system)
origin from the same server.
This prevents [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) problems.

The script `src/setupProxy.js` is responsible for integrating the proxy.
Rename or delete the script if you don't want or need the proxy. Behind the scenes we use the
[proxy feature](https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually)
of Create React App, but for convenience you only need to configure two files.

The default proxy configuration for local development is configured in `.env`,
which is committed to version control.
You can override these settings in your own `.env.local` which is not committed to version control,
since these are your personal settings and credentials.

Create file `.env.local` in the root directory with the following config as template
and use your username and password:

```
# override proxy settings if necessary
#REACT_APP_PROXY_URL=https://URL:PORT/sap/opu/odata/sap/
#REACT_APP_PROXY_SAP_CLIENT=300
#REACT_APP_PROXY_LOG_LEVEL=debug

# proxy credentials
REACT_APP_PROXY_SAP_USERNAME=YOUR_USER
REACT_APP_PROXY_SAP_PASSWORD=YOUR_PASSWORD
```

### Deployment

Use the file `.ui5deployrc` to configure your deployment.

### OData Services

We generate an OData client out of provided metadata and some configuration
by using [odata2model](https://www.npmjs.com/package/@odata2ts/odata2model).

Configure the generation in `odata2ts.config.js`.

As an example, the [Trippin OData V4 example service](https://www.odata.org/odata-services/)
is integrated by default. To provide your own service download the metadata (BASE_URL/$metadata)
and overwrite `src/asset/odata/odata-service.xml`.

Then generate a type-safe OData client by `npm run gen-odata`. Files will be generated under
`src/odata/odata-service`.

## Development: `npm run start`

Runs the app in the development mode.\
Automatically opens [http://localhost:3000](http://localhost:3000) in your main browser.
Deactivate this behavior via `BROWSER=none` in your `.env.local` file.

The page will reload if you make edits.\
You will also see any lint and typescript errors in the console.

### Testing: `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Tests should not be put under a separate `test` folder, but must reside within the `src` folder.
Thus, to create a test for file `ExampleScreen.ts`, create a file with the suffix `.test.ts` right beside it:
`ExampleScreen.test.ts`. Base file content:

```tsx
describe("My Tests", () => {
    const testFunction = () => "test"

    test("should work", () => {
        expect(testFunction()).toBe("test");
    })
})
```

### Build: `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Build Deployment: `npm run deploy --user YOUR_USER --pwd YOUR_PASSWORD`

Uploads the app to your SAP System. Execute `npm run build` before.
