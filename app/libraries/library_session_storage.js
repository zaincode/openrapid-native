import * as SecureStore from "expo-secure-store";

module.exports = {
   async set(name, value) {
      try {
         // Stroing data
         await SecureStore.setItemAsync(name, JSON.stringify(value));
      } catch (error) {
         // Error saving data
         console.log("Failed storing data");
      }
   },
   async get(name) {
      try {
         const value = await SecureStore.getItemAsync(name);
         if (value !== null) {
            return JSON.parse(value);
         }
      } catch (error) {
         // Error retrieving data
         console.log("Failed retrieving data data");
      }
   },
   async unset(name) {
      try {
         await SecureStore.deleteItemAsync(name);
      } catch (error) {
         // Error retrieving data
         console.log("Failed retrieving data data");
      }
   },
};
