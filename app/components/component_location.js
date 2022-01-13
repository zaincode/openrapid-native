import React from "react";
import { View } from "react-native";
import * as Location from "expo-location";

// Check if location permissionn is allowed on the app
export const IsPermissionAllowed = async () => {
   let { status } = await Location.getForegroundPermissionsAsync();
   return status === "granted";
};

// Prompt a permission request
export const RequestPermission = async () => {
   if (await IsPermissionAllowed()) {
      let request = await Location.getForegroundPermissionsAsync();
      return request;
   } else {
      let request = await Location.requestForegroundPermissionsAsync();
      return request;
   }
};

// Get user current location
export const GetCurrentPosition = async (options = {}) => {
   var locationOptions = {
      accuracy: Location.Accuracy[options.accuracy !== undefined ? options.accuracy : "Balanced"],
      ...options,
   };
   if (options.ask !== undefined && options.ask == true) {
      await RequestPermission();
   }
   const currentPosition = await Location.getCurrentPositionAsync(locationOptions);
   return currentPosition;
};

export const Address = async (params = {}) => {
   return await Location.reverseGeocodeAsync(params);
};

export const GeoCodeAddress = async (address, useGoogleMaps = false) => {
   return await Location.geocodeAsync(address, {
      useGoogleMaps: useGoogleMaps,
   });
};
