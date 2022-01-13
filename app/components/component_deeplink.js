import * as Linking from "expo-linking";

export const Generate = (path, params = {}) => {
   return Linking.createURL(path, {
      queryParams: params,
   });
};
