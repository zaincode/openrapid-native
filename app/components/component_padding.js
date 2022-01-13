import React from "react";
import { View } from "react-native";

export default (props) => {
   return (
      <View
         style={[
            {
               margin: props.size !== undefined ? props.size : 5,
            },
         ]}
         {...props}
      ></View>
   );
};
