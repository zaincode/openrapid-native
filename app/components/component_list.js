import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../configs/config_global";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Text from "./component_text";
import Indicator from "./component_indicator";

export default (props) => {
   return (
      <TouchableOpacity
         {...props}
         style={[
            style.list,
            props.background !== undefined ? { backgroundColor: props.background } : false,
            props.autoMargin !== undefined
               ? {
                    marginHorizontal: 15,
                    marginVertical: 9,
                 }
               : false,
            props.autoPadding !== undefined
               ? {
                    padding: 15,
                 }
               : false,
            props.style,
         ]}
      >
         {props.icon !== undefined ? (
            <View style={style.list_icon}>
               {typeof props.icon === "object" ? (
                  <React.Fragment>
                     {props.icon !== undefined && props.icon.name !== undefined ? (
                        <Ionicons
                           name={props.icon.name}
                           size={props.icon.size !== undefined ? props.icon.size : 17}
                           color={
                              props.icon.color !== undefined ? props.icon.color : theme().font.color
                           }
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

         <View style={style.list_content}>
            {props.text !== undefined ? (
               <Text {...props.textProps} style={[style.list_title, props.textStyle]} bold>
                  {props.text}
               </Text>
            ) : (
               false
            )}
            {props.description !== undefined ? (
               <Text
                  {...props.descriptionProps}
                  style={[style.list_description, props.descriptionStyle]}
               >
                  {props.description}
               </Text>
            ) : (
               false
            )}
            {props.children}
         </View>

         {props.renderRight !== undefined ? props.renderRight : false}

         <Indicator type={props.indicator} />

         {props.loading !== undefined && props.loading == true ? (
            <Animatable.View animation="fadeInUp" duration={100}>
               <ActivityIndicator
                  style={{ marginLeft: 10, opacity: 0.5 }}
                  size={"small"}
                  color={theme().font.color}
               />
            </Animatable.View>
         ) : (
            false
         )}

         {props.chevron ? (
            <Ionicons
               style={{ marginLeft: 5 }}
               name={"chevron-forward"}
               size={20}
               color={theme().color.font}
            />
         ) : (
            false
         )}
      </TouchableOpacity>
   );
};

const style = StyleSheet.create({
   text: {
      fontSize: theme().font.size,
      color: theme().font.color,
      fontFamily: "regular",
   },
   list: {
      flexDirection: "row",
      overflow: "hidden",
      alignItems: "center",
   },
   list_content: {
      flex: 1,
      marginRight: 10,
   },
   list_title: {
      lineHeight: 18,
   },
   list_description: {
      marginTop: 3,
      lineHeight: 18,
   },
   list_icon: {
      marginRight: 10,
   },
});
