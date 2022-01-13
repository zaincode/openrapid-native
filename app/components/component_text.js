import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme } from "../configs/config_global";

export default (props) => {
   return (
      <Text
         {...props}
         style={[
            style.text,
            props.style,
            props.autoMargin !== undefined
               ? {
                    marginHorizontal: 15,
                    marginVertical: 2,
                 }
               : false,
            props.large !== undefined
               ? {
                    fontSize: theme().font.sizeLarge,
                    lineHeight: 28,
                 }
               : false,
            props.medium !== undefined
               ? {
                    fontSize: theme().font.sizeMedium,
                 }
               : false,
            props.dim !== undefined ? { opacity: 0.6 } : false,
            props.bold !== undefined ? { fontFamily: "bold" } : false,
         ]}
      >
         {props.children !== undefined ? props.children : ""}
      </Text>
   );
};

const style = StyleSheet.create({
   text: {
      fontSize: theme().font.size,
      color: theme().font.color,
      fontFamily: "regular",
   },
});
