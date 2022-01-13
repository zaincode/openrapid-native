import React from "react";
import { View } from "react-native";

export default (props) => {
   return (
      <View
         style={[
            {
               flex: 1,
               alignItems: "center",
               justifyContent: "center",
            },
         ]}
         {...props}
      ></View>
   );
};
