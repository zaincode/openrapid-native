// Bootstraped by Royan Zain, @2022 - Feel free to adjust with your needs
// This is the main entry of the app
// Normally you wouldnt have to change this code that much
// Unless you have to add some dependencies or global variables
import React from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { Provider } from "mobx-react";
import * as Font from "expo-font";
import Shared from "app/components";
// Imports all screens ass routes that are available in ./configs/config.route
import Router from "./app/configs/config_router";
// Create a store instance
import Stores from "./app/stores/store";
// add the instance globally
const AppStores = (window.store = new Stores());
// Store all of fonts resources
const customFonts = {
   regular: require("./assets/fonts/Proxima/Proxima-Nova-Reg.otf"),
   bold: require("./assets/fonts/Proxima/Proxima-Nova-Semibold.otf"),
};
// Global Error Handler
// This function will fired up everytime there is an error in development and production
ErrorUtils.setGlobalHandler(async function (error) {
   Shared.Report.Error(error, {
      tag: "GLOBAL_ERROR_HANDLER",
   });
});
// Ignore the yellow box thing
LogBox.ignoreAllLogs();
// Here is the main app and we go ... Above and away!
export default class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isFontLoaded: false,
      };
   }
   async loadFonts() {
      await Font.loadAsync(customFonts);
      this.setState({ isFontLoaded: true });
   }
   componentDidMount() {
      this.loadFonts();
   }
   render() {
      if (this.state.isFontLoaded == true) {
         return (
            // Wraps routes with provider
            <Provider stores={AppStores}>
               <StatusBar style="light" />
               <Router />
            </Provider>
         );
      } else {
         return null;
      }
   }
}
