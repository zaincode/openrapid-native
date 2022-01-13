import { makeAutoObservable } from "mobx";
import { HttpRequest } from "../libraries/library_http_request";
const config = require("../configs/config_global");

export default class GlobalStore {
   constructor() {
      makeAutoObservable(this);
   }

   config = config;

   // Identifier if the app is still authenticating user
   isAuthenticating = false;
   // Check wether the user is authenticated to display certain screens
   isUserAuthenticated = false;

   // Local notification object
   localNotification = null;
   // Identifier for notification visibility
   isLocalNotificationVisible = false;

   // Copilots
   isCopilotVisible = false;
   copilotSequences = [];
   selectedCopilotIndex = null;

   copilot = () => {
      this.isCopilotVisible = true;
   };

   copilotAdd = (data) => {
      this.copilotSequences.push(data);
   };

   // Set local notificationn
   setLocalNotification = (props, timeout = 3000) => {
      // Remove existing notification on the screen
      if (this.isLocalNotificationVisible == true) {
         this.isLocalNotificationVisible = false;
         clearTimeout(this.notificationTimeout);
      }

      if (timeout !== false) {
         // Set notification to appear
         this.isLocalNotificationVisible = true;
         // Fills up the notification with object property such as icon, title, description etc.
         this.localNotification = props;
         // for 5 seconds notification will show up
         this.notificationTimeout = setTimeout(() => {
            this.removeLocalNotification();
         }, timeout);
      } else {
         // Display notification without automatically hiding it
         this.isLocalNotificationVisible = true;
         // Fills up the notification with object property such as icon, title, description etc.
         this.localNotification = props;
      }
   };

   // Remove notification
   removeLocalNotification = () => {
      // Hide the notification
      this.isLocalNotificationVisible = false;
      // Clears up the object
      this.localNotification = null;
      // Clear timeout
      clearTimeout(this.notificationTimeout);
   };

   HttpPostRequest = async (path, data, extraHeaders = {}) => {
      // Append Token Header If exist
      Object.assign(extraHeaders, {});
      // Call the api request
      const callRequest = await HttpRequest.post(config.url + path, data, extraHeaders);
      if (callRequest != false) {
         return callRequest;
      } else {
         return false;
      }
   };

   HttpGetRequest = async (path, extraHeaders = {}) => {
      // Append Token Header
      Object.assign(extraHeaders, {});
      // Call the api request
      const callRequest = await HttpRequest.get(config.url + path, extraHeaders);
      if (callRequest != false) {
         return callRequest;
      } else {
         return false;
      }
   };
}
