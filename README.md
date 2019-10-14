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
There are a lot of built in niceties within this template.

### Plugins
We use plugins to mutate what the default Vue object is. We can add methods, components, and many other things to the Vue object so that these tools can be accessed through the Vue object versus importing in everything. All of these files can be found in `src/global/public`. As a general practice, we start all plugin methods with a `$`.

- toast.js
  - what: This is a non-intrusive alert method that briefly shows a message to the user before disappearing without any further action from the user,
  - example: The user has just updated her personal information in her profile. After the data has saved successfully, you include in the code `this.$toast('Information saved successfully.')` to indicate to the user the information has been saved without any further action from the user.
  
- time.js
  - what: This plugin assists in displaying the date/time in whatever manner you need. The method `$buildDate` allows you to input a Date (could be timestamp) and a string indicating what you want the date to look like and then outputs the resulting string.
  - example: You want to show the date a message was delivered in the format `September 20th, 1993 at 4:13 am`. You can do this by calling `this.$buildDate(message.delivered, '{fullMonth} {date}{dateEnding}, {year} at {hour}:{minutes} {meridian}')`
- regex.js
  - what: To check if a string is of certain format, you can use this plugin by simply inputing your string and declaring what you are checking to see what it is and receive back a boolean.
  - example: If you want to see if an input is actually a telephone number, use `this.$regex.is(input).a('phone')`.
- 
