# Redfast React Native Example App

Contact your Customer Success Manager to obtain the Redfast tokens in order to activate the test app.

## Install Redfast react native SDK packages

This is a local package installation. We may explore a private [npm registry](https://docs.npmjs.com/about-private-packages) solution in the future.

1. Obtain the .tgz SDK packages. The `redfast-core` package contains the API communication and state management logic, while `redfast-react-native` contains the pre-built UI components. The `redfast-react-native` package is optional, as only the `redfast-core` is needed in the event the pre-built UI components are not to be utilized.

```bash
redfast-redfast-core-1.0.0.tgz
redfast-react-native-redfast-0.1.0.tgz
```

2. Install the packages. 

<span style="color:red">**Important**</span>: use `npm` instead of `yarn` for installation

```bash
npm install <LOCAL_PATH_TO>/redfast-redfast-core-1.0.0.tgz
npm install <LOCAL_PATH_TO>/redfast-react-native-redfast-0.1.0.tgz
```

## Run the example app

```bash
nvm use 18.18 # minimum node version
npm run start # or yarn start
```
