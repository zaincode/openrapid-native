import React from "react";
import { Text, View, ToastAndroid } from "react-native";
// Uses observer and inject from mobx-react
import { observer, inject } from "mobx-react";
import * as Updates from "expo-updates";
import Routes from "./config_routes";
import Shared from "app/components";

// Router Class
@inject("stores")
@observer
export default class Router extends React.PureComponent {
   constructor(props) {
      super(props);
   }

   async componentDidMount() {
      try {
         const update = await Updates.checkForUpdateAsync();
         if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
            this.checkAuthentication();
         } else {
            this.checkAuthentication();
         }
      } catch (e) {
         // handle or log error
         Shared.Report.Warning(e);
         // Development Mode, ignore udpates
         this.checkAuthentication();
      }
   }

   checkAuthentication = async () => {};

   componentWillUnMount() {}

   render() {
      // If the app is finished authenticating user
      if (this.props.stores.global.isAuthenticating == false) {
         // Displays available routes in ./app/routes/ directory
         return <Routes />;
      } else {
         // if the app still authenticating user / Calling API Request
         // Fill free to change this to for example a loader animation etc.
         return null;
      }
   }
}
