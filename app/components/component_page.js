import React from "react";
import { View } from "react-native";

export const Await = (props) => {
   return (
      <View
         style={[
            { flex: 1 },
            props.isLoading
               ? {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                 }
               : false,
            props.style,
         ]}
      >
         {props.isLoading ? (
            <React.Fragment>{props.loader !== undefined ? props.loader : false}</React.Fragment>
         ) : (
            props.children
         )}
      </View>
   );
};
