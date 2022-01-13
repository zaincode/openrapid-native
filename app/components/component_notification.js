import React from "react";
import { Platform, Alert, Linking, View, Text, Button } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Log } from "./component_report";
import * as IntentLauncher from "expo-intent-launcher";

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
   }),
});

// Component to handle incoming notification
export const Receiver = (props) => {
   const notificationListener = React.useRef();
   const responseListener = React.useRef();

   React.useEffect(() => {
      notificationListener.current = Notifications.addNotificationReceivedListener(
         (notification) => {
            if (props.onReceive !== undefined) {
               props.onReceive(notification.request);
            }
         }
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
         ({ notification }) => {
            if (props.onReceiveResponse !== undefined) {
               props.onReceiveResponse(notification.request);
            }
         }
      );

      return () => {
         Notifications.removeNotificationSubscription(notificationListener.current);
         Notifications.removeNotificationSubscription(responseListener.current);
      };
   }, []);
   return null;
};

// Register or fetch the expo push notification token
export const Register = async (props) => {
   if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== "granted") {
         Log("Failed fetching push notification token, Permission is not granted");
         return null;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
   } else {
      Log(
         "Failed fetching push notification token, Must use physical device for Push Notifications"
      );
      return token;
   }
};

// Check for notification permission
export const IsAllowed = async (props) => {
   return (await Notifications.getPermissionsAsync()).status === "granted";
};

// Prompt notification permission
// Let the use know that the notification permission is turned off
// User will redirected to the app notification page
export const Prompt = () => {
   Alert.alert(
      "No Notification Permission",
      "Please go to app setting and allow notification permission",
      [
         { text: "Cancel" },
         {
            text: "Setting",
            onPress: () =>
               Platform.OS == "android"
                  ? IntentLauncher.startActivityAsync(
                       IntentLauncher.ActivityAction.NOTIFICATION_SETTINGS
                    )
                  : Linking.openURL("app-settings:"),
         },
      ],
      { cancelable: true }
   );
};

// Send local push notification to the app
export const SendLocal = async (content, options = {}) => {
   await Notifications.scheduleNotificationAsync({
      content: content,
      trigger: options.trigger !== undefined ? options.trigger : null,
      ...options,
   });
};
