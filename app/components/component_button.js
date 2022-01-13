import React from "react";
import { Text, StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../configs/config_global";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default (props) => {
   return (
      <TouchableOpacity
         disabled={props.loading !== undefined ? props.loading == true : false}
         {...props}
         style={[
            style.button_style,
            props.style,
            props.autoMargin !== undefined ? { margin: 15 } : false,
            props.shape !== undefined && props.shape == "round" ? style.button_style_round : false,
            props.shape !== undefined && props.shape == "outline"
               ? style.button_style_outline
               : false,
            props.transparent !== undefined && props.transparent === true
               ? {
                    backgroundColor: "transparent",
                    paddingHorizontal: 0,
                 }
               : false,
         ]}
      >
         <View style={style.button_content}>
            {props.icon !== undefined ? (
               <View style={style.input_icon}>
                  {typeof props.icon === "object" ? (
                     <React.Fragment>
                        {props.icon !== undefined && props.icon.name !== undefined ? (
                           <Ionicons
                              name={props.icon.name}
                              size={props.icon.size !== undefined ? props.icon.size : 17}
                              color={
                                 props.shape !== undefined && props.shape == "outline"
                                    ? theme().font.color
                                    : props.icon.color !== undefined
                                    ? props.icon.color
                                    : theme().font.colorSecondary
                              }
                           />
                        ) : (
                           false
                        )}
                     </React.Fragment>
                  ) : (
                     <React.Fragment>
                        <Ionicons
                           name={props.icon}
                           size={17}
                           color={
                              props.shape !== undefined && props.shape == "outline"
                                 ? theme().font.color
                                 : theme().font.colorSecondary
                           }
                        />
                     </React.Fragment>
                  )}
               </View>
            ) : (
               false
            )}

            {props.icon !== undefined &&
            props.icon.border !== undefined &&
            props.icon.border == true ? (
               <View
                  style={{
                     height: "50%",
                     width: 1,
                     backgroundColor: theme().color.border,
                     marginRight: 11,
                  }}
               />
            ) : (
               false
            )}

            {props.renderIcon !== undefined ? <View>{props.renderIcon}</View> : false}
            {props.rendeLeft !== undefined ? props.renderLeft : false}
            <Text
               multiline={false}
               style={[
                  style.text,
                  props.textStyle,
                  props.icon !== undefined ? { marginRight: 5 } : false,
                  props.shape !== undefined && props.shape == "outline"
                     ? {
                          color: theme().font.color,
                       }
                     : false,
               ]}
            >
               {props.children}
            </Text>
            {props.rendeLeft !== undefined ? props.renderLeft : false}
            {props.loading !== undefined && props.loading == true ? (
               <Animatable.View animation="fadeInLeft" duration={100}>
                  <ActivityIndicator
                     style={{ marginLeft: 10 }}
                     size={"small"}
                     color={theme().font.colorSecondary}
                  />
               </Animatable.View>
            ) : (
               false
            )}
         </View>
      </TouchableOpacity>
   );
};

const style = StyleSheet.create({
   button_style: {
      height: theme().input.height - 5,
      backgroundColor: theme().color.primary,
      borderRadius: 5,
      padding: 10,
      paddingHorizontal: 15,
      overflow: "hidden",
      alignSelf: "flex-start",
      justifyContent: "center",
   },
   button_content: {
      flexDirection: "row",
      alignItems: "center",
   },
   button_style_round: {
      borderRadius: theme().input.height / 2,
      paddingHorizontal: 15,
   },
   button_style_outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme().color.primary,
   },
   text: {
      fontSize: 14,
      color: theme().font.colorSecondary,
      fontFamily: "bold",
      marginTop: Platform.OS == "android" ? 0 : 1,
   },
   input_icon: {
      paddingRight: 8,
      justifyContent: "flex-start",
      alignItems: "center",
   },
});
