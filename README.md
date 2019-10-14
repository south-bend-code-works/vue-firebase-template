# vue-firebase-template

## Sup Nerd

If you're tryna start a Firebase / Vue project and not do it from scratch, follow the instructionals below.

### Prereqs.

If you don't know how to do the following, you should learn how to do the following:
- Start a firebase project.
- Retrieve the Firebase config.
- Retrieve a Firebase service account.
- Enable auth types in a Firebase project.

### 1) G(i)t your own.
- Start by clicking the `Fork` button on the Github page for this project.
- Once you have forked the project into your organization, clone it onto your local machine.

### 2) NPM yourself.
- In the terminal, cd into the root of the project.
- Run `npm install` to download all those helpful packages.
- Then, cd into the `functions` directory
- Again, run `npm install` to get all necessary packages for the backend.

### 3) Identify yourself (frontend)
- Create a file in the root named `.env.local`.
- Retrieve your Firebase project config from the Firebase console.
- Stringify the config.
- In your `.env.local` file, you will need to declare 2 variables: `VUE_APP_FIREBASE_CONFIG` and `FIREBASE_CONFIG`
- Then, set both variables equal to the stringified version of the Firebase config.
  - Ex.: 
  ```
  VUE_APP_FIREBASE_CONFIG="{"apiKey":"some_api_value","authDomain":...,...,...}"
  FIREBASE_CONFIG="{"apiKey":"some_api_value","authDomain":...,...,...}"
  ```
### 4) Identify yourself AGAIN (backend)
- cd into the `functions` directory
- Log into Firebase using the account that has the Firebase project you want to use
- Run `firebase use {{name of your firebase project}}`
- Create a file in the `functions/src` directory called `service-account.json`.
- Using the Firebase console, download a new private key under the Service Account tab in Settings
- Paste contents of the downloaded file into `service-account.json`.

### 5) FIRE-IDDUP!!!
- In the root of the project, run `npm run serve` to start the front end.
- cd into the `functions` directory and run `npm run serve` to start the back end.
- Visit localhost:3000 to test it out.
- P.S. The console will complain about a missing manifest.JSON file until you run `npm run build` in the root directory but it shouldn't affect development

## Cool Kids Know Stuff
There are a lot of built in niceties
