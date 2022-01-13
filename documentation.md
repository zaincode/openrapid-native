###### Documentation Version 1.0.0

# openrapid-native

###### react-native-expo bootstrap

---

openrapid-native is a simple bootstrap of react native with expo based project that allow you to build your project even faster and efficient with less code and reinventing wheels. with tons of usefull pre-coded libraries ready to use.

### Structure

```
└─app
│  └─components
│  └─libraries
│  └─configs
│    │ config_global.js
│  └─screens
│    │ index.js
│    │ screen_example.js
│  └─stores
│    │ index.js
│    │ screen_global.js
└─assets
└─App.js
└─app.json
```

##### # App.js

this is the main entry of application, this file would be the first to execute when running application. you wouldn't have to change anything in this file unless you want to add a custom code or modify the existing one.

##### # app/components

contains all the components that are more likely to use across the screens, there are also built-in components to make it easier in terms of using feature like `location`, `camera`, `push notification`, `liveness detection` and many more.

##### # app/libraries

contains all of libaries such as `Helper`, `HttpRequest` and `Session` library, you can also add your own library here

##### # app/screens

contains all of screen or page of your application, if you want to connect this screen to main global store please follow the code just like what it looks like in `app/screens/screen_example`. make sure to import your screen in `app/screens/index.js` to automatically register your page to routes.

######Screen Structure
this is the example of `app/screens/index.js` screen structure

```javascript
import ScreenExample from "./screen_example";

export default {
   ExampleScreen: {
      screen: ScreenExample,
      options : // Optional screen options
   },
};
```

you can also add screen authentication, this just basically means if a screen required an authetication to be able to load in your app. this will be triggered by changing the global variable `this.props.stores.global.isUserAuthenticated`

```javascript
import ScreenExample from "./screen_example";

export default {
   ExampleScreen: {
      screen: ScreenExample,
      // this screen required authentication
      authentication: true,
   },
};
```

the common use case of this is when you need to seperate screen beetween login page and profile page in your app. to be able to access profile page you have to login first otherwise the profile page will not be loaded.

```javascript
@inject("stores")
@observer
export default class Screen extends React.Component {
   constructor(props) {
      super(props);
   }

   handleLogin = () => {
      // This will load all of the screen that requires authentication
      this.props.stores.global.isUserAuthenticated = true;
   };
}
```

if you want to make `tab navigation` or swipeable screen you can add `chidlren` property in your screen object.

```javascript
export default {
   Home: {
      children: {
         Feed: {
            screen: ScreenHome,
         },
         Profile: {
            screen: ScreenProfile,
            authentication: true,
         },
      },
      config: // optional properties refer to react-navigation tab-navigation config api
   }
}
```

##### # app/stores

contains all of your mobX store file. this file is accessable in every screen of your app. don't forget to register or import your store file in `app/stores/index.js`

---

### Routing

openrapid already use react-navigation ver. 5^, so it pretty much cover the latest technology in navigating between screens. you can navigate to another screen by simply calling `this.props.navigation.navigate()`

**Navigate to other screen**

```javascript
this.props.navigation.navigate("another_screen", optionalParams);
```

---

### Store

openrapid uses **MobX** as a state management library because of the ease of implementation and effectivity of it. make sure to save all of your store inside `./app/stores/` directory and register or import it in `./app/stores/index.js`

---

### Local Notification

local notification is a global function that allows you to display pop-up message with a customizeable parameters such as title, description and buttons. this pop up will appear in every screen in your app.

**Basic Usage**

```javascript
this.props.stores.global.setLocalNotification(params, timeout);
```

| Name    | Description                                                                        | Required |
| ------- | ---------------------------------------------------------------------------------- | -------- |
| params  | An object contains optional parameter                                              | Yes      |
| Timeout | The amount of time in milliseconds until the message dissapears (default is 3secs) | No       |

**Parameters**

| Name        | Description                                                                                                                            | Required |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| title       | The title of the pop-up message                                                                                                        | No       |
| description | Pop-up message description                                                                                                             | No       |
| onPress     | a function to trigger action when pressing the pop-up message box                                                                      | No       |
| button      | an object contains two functions (yes and cancel) which will be triggered when user taps on the button displayed on the pop-up message | No       |
| type        | customize the pop-up message box with a lil bit of border on top based on value error, success, warning and info                       | No       |
| toggle      | displays a centered line on top of the pop-up message box                                                                              | No       |
| icon        | an object contains (**name** and **size** from _antDesign_) to displays icon on the left side of the pop-up message box                | No       |

**Example**

```javascript
// This will automatically display a popup message
// And will dissapears after 3 seconds

this.props.stores.global.setLocalNotification({
   title: "Hello, World",
   description: "This is some additional message for the pop-up",
});
```

**Example With Parameter Type**

```javascript
// This will returns a red borderline
// To indicate that the message occured because of an error
// You can also set type to : warning | success | info

this.props.stores.global.setLocalNotification({
   type: "error",
   title: "Hello, World",
   description: "This is some additional message for the pop-up",
});

// You can also set the timeout to false if you want to disable auto hide
this.props.stores.global.setLocalNotification(
   {
      type: "error",
      title: "Hello, World",
      description: "This is some additional message for the pop-up",
   },
   false
);
```

**Example With Buttons**

```javascript
// By including button parameter, it will automatically render the button

this.props.stores.global.setLocalNotification(
   {
      type: "error",
      title: "Hello, World",
      description: "This is some additional message for the pop-up",
      button: {
         yes: () => {
            // Do some function stuff
         },
         cancel: {
            // Do some cancelling stuff
         },
      },
   },
   false
);
```

---
