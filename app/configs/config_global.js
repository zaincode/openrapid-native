// this is a global config file
// this config also accessible in every screen file through global store
// by accessing this.props.stores.global.config

import Constants from "expo-constants";

// Return API url
export const url = "";

// Turn on or off all reports
// If this turned off, all of the console.log in the terminal will not be displayed
export const debug = true;

// Returns theme for the app
export const theme = (selectedtheme = "default") => {
   if (selectedtheme === "default") {
      return {
         color: {
            primary: "#4834d4",
            secondary: "rgba(30, 30, 30, 0.9)",
            error: "#d63031",
            warning: "#f1c40f",
            success: "#44bd32",
            info: "#dcdde1",
            border: "rgb(235,235,235)",
            borderActive: "#4834d4",
            secondaryBorder: "rgba(10,10,10, 0.8)",
            font: "#202020",
            statusBar: "dark",
         },
         font: {
            color: "#202020",
            colorSecondary: "#ffffff",
            size: 14,
            sizeSmall: 13,
            sizeMedium: 15,
            sizeLarge: 22,
         },
         input: {
            height: 47,
            placeHolderColor: "rgb(180,180,180)",
            borderColor: "rgb(220,220,220)",
            backgroundColor: "rgb(255,255,255)",
         },
         statusBar: {
            height: Constants.statusBarHeight,
         },
      };
   }
};
