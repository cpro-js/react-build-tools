# Generator UI5 React

Scaffolds a complete React.js app based on [Create React App (CRA)](https://create-react-app.dev/)
and [Craco (CRA Configuration Override)](https://github.com/gsoft-inc/craco) to further customize the build,
in order to realize a tight Fiori Launchpad integration.

Uses [UI5 Web Components for React](https://sap.github.io/ui5-webcomponents-react/).

## Setup

### Installation

Yeoman must be installed, of course, which is done globally:
`npm install -g yo`

Now comes this generator: `npm install -g generator-ui5-react`

### Scaffolding

As usual: `yo `

## Local Testing

For testing any development of this package:

1. `yarn build`
2. `npm link`
3. create a new folder for the test app
4. create the test app: `yo ui5-react`
