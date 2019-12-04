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
- Start by downloading the zip of this project.

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

### Building

To build the frontend, run `npm run build` from the root of the directory. To build the backend, run `tsc` from the functions directory. When you run `npm run serve` from the functions directory, the files are built during that process. You will have to specifically run `tsc` to have any changes populate in the code.

### Plugins

There are some built in niceties within this template.

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
- pro-emissions.js
  - what: This plugin instantiates an event bus. An event bus allows for communication between any part of the code, regardless of ancestory or file type. It works using `on` and `emit`. First, you set up an `on` with a certain reference and callback. Then, in another part of the code, you `emit` (while passing an argument) referencing the `on` previously established. If the information you are sharing using pro-emmissions is widely used enough, it may make more sense to put the data in the store. However, if it is specific enough to only a few location, it may make sense to use pro-emissions. It is important to document the locations where it is being used so that debugging doesn't end up being a rabbit chase through the code.
  - example: You have an app that tracks the highest scores of players in real time. This data retrieved and displayed in a certain part of the app. However, this same exact data is needed in another part of the app as well. One strategy would be to retrieve the data twice, once for each location. However, instead of two retrievals, when the data is loaded in the first location, you can send the data to the other location. It would work by, in the second location, having the following code run: `this.$proOn('secondary-high-score-display', (data) => this.highScores = data)`. Then, where the data is originally loaded, after loading the data, you would run `this.$proEmit('secondary-high-score-display', highScores)`. This would send the data from the first location to the second without having to worry about ancestory or loading the data twice.
- pro-cookies.js
  - what: This plugin is simply a one method addition to `vue-cookies`, a plugin that allows `this.$cookies.set` and `this.$cookies.get` to set and get cookies easily. The additional method is `updateJSON` which takes a name of a existing cookies and a JSON object and, instead of overwriting the previously establised cookie like `set` would do, only overwrites fields of the cookie that exist in passed JSON object. In the situation where no cookie with the given name exists, a new cookies is created. This is especially helpful when storing form inputs as cookies.
  - example: You have a lengthy form that has 5 pages. In the situation where the user does not complete the form in one go, you want to store the results in the cookies as to prevent a complete start-over. So, as the user advances pages of the form, you store the form of the current page by running `this.$cookies.updateJSON(this.form)`. It will update the form in the same cookie as the previous pages' forms.
- modals.js
  - what: This plugin allows for modals to appear and disappear easily. The plugin and its associated component `ModalMain` (src/components/modals/Main.vue) should not be heavily customized (except for style). This is because it is set up to pass options to the modals that are to be created. This can include callbacks, options, styles, etc. It is also set up to allow for multiple modals to exists simultaneously.
  - example: You are instructed (by your aggressive designer) to no longer use the default `alert` provided by default and transition all alert messages to a custom alert modal (there is one in the template as an example). So, you create a modal named Alert.vue, import it into `ModalMain`, and declare it in your components as `alert`. Then, you call it `this.$modals.show({name: 'alert', message: 'I am alerting you!'})`. In you Alert.vue file, you will need to include in the props a prop named `options`. You will be able to retrieve and display the alert message by calling `this.options.message` in the code or `{{options.message}}` in the template.
- loading.js
  - what: This plugin, paired with the component `Loading` (src/components/common/Loading.vue), allows you to show and hide loading from anywhere in the code. There are 3 methods associated with the plugin, `$showLoading`, `$hideLoading`, and `$flashLoading`. `$showLoading` and `$hideLoading` take no arguments behave as you would expect. `$flashLoading` takes an argument that is a callback. It shows loading, waits .250 seconds, runs the callback, and then waits .250 seconds before hiding loading. It's a way to have smooth transitions between screens or actions.
  - example: You have a page where you show a user all her transactions. On mounted, you run `this.$showLoading()` to hide the fact that you have no transactions loaded yet. Then, once transactions are loaded and put into place, you run `this.$hideLoading()` to reveal the loaded transactions.
- HTTP.js
  - what: This plugin allows api calls to be made without the hassle of importing security creds, figuring out your current backend url, and other repetitive tasks. You need to include your method and uri. The security creds are included by default but you can disable them by setting `secure` to `false` in the options. For `put` and `post` methods, you send data by setting the `body` field to the data you would like to send.
  - example: For a new sign up, you have a form for the user to fill out that needs to be sent to your backend for user creation. All the necessary form data is stored in `this.form`. So, to make the call, the code you need is `this.$HTTP({method: 'post', uri: 'users', body: this.form})`. The plugin returns a Promise so you can set your callbacks or your awaits in order to handle failures and successes.
- form-helpers.js
  - what: This plugin is pretty specific to how Joshua Mullet creates and validates forms. The explanation is long and arduous so if you would like to learn how to use it, checkout the plugin and SignUp.vue to see an example of it in action.
