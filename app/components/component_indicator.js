import React from "react";
import { theme } from "../configs/config_global";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default (props) => {
   if (props.type !== undefined) {
      if (props.type == "success") {
         return (
            <Animatable.View duration={300} animation={"zoomIn"} style={props.style}>
               <Ionicons
                  name={"md-checkmark-circle-outline"}
                  size={props.size != undefined ? props.size : 20}
                  color={theme().color.success}
               />
            </Animatable.View>
         );
      } else if (props.type == "error") {
         return (
            <Animatable.View duration={600} animation={"bounceInDown"} style={props.style}>
               <Ionicons
                  name={"close-circle-outline"}
                  size={props.size != undefined ? props.size : 20}
                  color={theme().color.error}
               />
            </Animatable.View>
         );
      } else {
         return null;
      }
   } else {
      return null;
   }
};
