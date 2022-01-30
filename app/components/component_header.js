import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { theme } from "../configs/config_global";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Text from "./component_text";

export default (props) => {
   return (
      <View
         {...props}
         style={[
            style.header,
            props.style,
            props.background !== undefined ? { backgroundColor: props.background } : false,
            props.elevate !== undefined
               ? {
                    elevation: props.elevate,
                 }
               : false,
         ]}
      >
         <StatusBar style={props.statusBarStyle !== undefined ? props.statusBarStyle : theme().color.statusBar} />
         {props.rendeLeft !== undefined ? props.renderLeft : false}
         {props.onGoBack !== undefined ? (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={props.onGoBack}>
               <Ionicons
                  name={"arrow-back"}
                  size={20}
                  color={props.backArrowColor !== undefined ? props.backArrowColor : theme().font.color}
               />
            </TouchableOpacity>
         ) : (
            false
         )}
         {props.icon !== undefined ? (
            <View style={style.input_icon}>
               {typeof props.icon === "object" ? (
                  <React.Fragment>
                     {props.icon !== undefined && props.icon.name !== undefined ? (
                        <Ionicons
                           name={props.icon.name}
                           size={props.icon.size !== undefined ? props.icon.size : 17}
                           color={props.icon.color !== undefined ? props.icon.color : theme().font.color}
                        />
                     ) : (
                        false
                     )}
                  </React.Fragment>
               ) : (
                  <React.Fragment>
                     <Ionicons name={props.icon} size={17} color={theme().font.color} />
                  </React.Fragment>
               )}
            </View>
         ) : (
            false
         )}
         {props.renderIcon !== undefined ? <View>{props.renderIcon}</View> : false}
         <View style={style.header_content}>
            <Text bold {...props.textProps} style={[style.header_text, props.textStyle]}>
               {props.text}
            </Text>
            {props.description !== undefined ? (
               <Text {...props.descriptionProps} style={[style.header_descrption, props.descriptionStyle]}>
                  {props.description}
               </Text>
            ) : (
               false
            )}
         </View>
         {props.renderRight !== undefined ? props.renderRight : false}
      </View>
   );
};

const style = StyleSheet.create({
   header: {
      padding: 15,
      paddingTop: Constants.statusBarHeight,
      flexDirection: "row",
      alignItems: "center",
   },
   header_content: {
      flex: 1,
      marginRight: 10,
   },
   header_text: {
      fontSize: theme().font.sizeMedium,
   },
   header_descrption: {
      marginTop: 5,
      opacity: 0.5,
   },
   input_icon: {
      marginRight: 10,
      borderRightWidth: 1,
      borderRightColor: theme().color.border,
      paddingRight: 10,
   },
});
