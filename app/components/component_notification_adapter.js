import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { observer, inject } from "mobx-react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { theme } from "/configs/config_global";

// Router Class
@inject("stores")
@observer
export default class LocalNotificationAdapter extends React.PureComponent {
   handleOnPressNotification = () => {
      if (this.props.stores.global.localNotification.button == undefined) {
         if (this.props.stores.global.localNotification.onPress !== undefined) {
            this.props.stores.global.localNotification.onPress();
         } else {
            this.props.stores.global.removeLocalNotification();
         }
      }
   };

   render() {
      if (
         this.props.stores.global.isLocalNotificationVisible === true &&
         this.props.stores.global.localNotification !== null
      ) {
         return (
            <Animatable.View style={style.style_notification_badge_container} animation="slideInUp" duration={300}>
               <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                     style.style_notification_badge_wrapper,
                     this.props.stores.global.localNotification.type !== undefined &&
                     this.props.stores.global.localNotification.type === "error"
                        ? style.style_notification_badge_wrapper_error
                        : false,
                     this.props.stores.global.localNotification.type === "warning"
                        ? style.style_notification_badge_wrapper_warning
                        : false,
                     this.props.stores.global.localNotification.type === "success"
                        ? style.style_notification_badge_wrapper_success
                        : false,
                     this.props.stores.global.localNotification.type === "info"
                        ? style.style_notification_badge_wrapper_info
                        : false,
                  ]}
                  onPress={this.handleOnPressNotification}
               >
                  {this.props.stores.global.localNotification.toggle !== undefined ? (
                     <View style={style.style_notification_badge_toggle} />
                  ) : (
                     false
                  )}
                  <View style={style.style_notification_badge_context}>
                     <View style={style.style_notification_badge_content}>
                        {this.props.stores.global.localNotification.icon !== undefined &&
                        this.props.stores.global.localNotification.icon.name !== undefined ? (
                           <Ionicons
                              name={this.props.stores.global.localNotification.icon.name}
                              size={
                                 this.props.stores.global.localNotification.icon.size !== undefined
                                    ? this.props.stores.global.localNotification.icon.size
                                    : 26
                              }
                              color={theme().font.colorSecondary}
                              style={{
                                 marginVertical: 10,
                                 alignSelf: "center",
                              }}
                           />
                        ) : (
                           false
                        )}
                        {this.props.stores.global.localNotification.title !== undefined ? (
                           <Text style={style.style_notification_badge_content_title}>
                              {this.props.stores.global.localNotification.title}
                           </Text>
                        ) : (
                           false
                        )}
                        {this.props.stores.global.localNotification.description !== undefined ? (
                           <Text
                              style={[
                                 style.style_notification_badge_content_description,
                                 this.props.stores.global.localNotification.title == undefined
                                    ? {
                                         marginTop: 0,
                                      }
                                    : false,
                              ]}
                           >
                              {this.props.stores.global.localNotification.description}
                           </Text>
                        ) : (
                           false
                        )}
                     </View>
                     {this.props.stores.global.localNotification.onPress !== undefined ? (
                        <View>
                           <Entypo
                              name="chevron-small-right"
                              size={26}
                              style={{
                                 opacity: 0.5,
                                 alignSelf: "flex-end",
                              }}
                              color={theme().font.colorSecondary}
                           />
                        </View>
                     ) : (
                        false
                     )}
                  </View>
                  {this.props.stores.global.localNotification.button !== undefined ? (
                     <View style={style.style_notification_badge_footer}>
                        {this.props.stores.global.localNotification.button.yes !== undefined ? (
                           <TouchableOpacity
                              onPress={this.props.stores.global.localNotification.button.yes.onPress}
                              style={style.style_notification_badge_footer_item}
                           >
                              <Text numberOfLines={1} style={style.style_notification_badge_footer_item_text}>
                                 {this.props.stores.global.localNotification.button.yes.caption !== undefined
                                    ? this.props.stores.global.localNotification.button.yes.caption
                                    : "Yes"}
                              </Text>
                           </TouchableOpacity>
                        ) : (
                           false
                        )}
                        {this.props.stores.global.localNotification.button.yes !== undefined &&
                        this.props.stores.global.localNotification.button.cancel !== undefined ? (
                           <View style={{ width: 20 }} />
                        ) : (
                           false
                        )}
                        {this.props.stores.global.localNotification.button.cancel !== undefined ? (
                           <TouchableOpacity
                              onPress={this.props.stores.global.localNotification.button.cancel.onPress}
                              style={style.style_notification_badge_footer_item_cancel}
                           >
                              <Text numberOfLines={1} style={style.style_notification_badge_footer_item_text_cancel}>
                                 {this.props.stores.global.localNotification.button.cancel.caption !== undefined
                                    ? this.props.stores.global.localNotification.button.cancel.caption
                                    : "Cancel"}
                              </Text>
                           </TouchableOpacity>
                        ) : (
                           false
                        )}
                     </View>
                  ) : (
                     false
                  )}
               </TouchableOpacity>
            </Animatable.View>
         );
      } else {
         return null;
      }
   }
}

const style = StyleSheet.create({
   style_notification_badge_container: {
      position: "absolute",
      width: Dimensions.get("window").width,
      bottom: 0,
   },
   style_notification_badge_wrapper: {
      margin: 30,
      backgroundColor: theme().color.secondary,
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      borderWidth: 1,
      backgroundColor: theme().color.secondary,
      borderColor: theme().color.secondaryBorder,
   },
   style_notification_badge_wrapper_error: {
      borderTopWidth: 5,
      borderTopColor: theme().color.error,
   },
   style_notification_badge_wrapper_success: {
      borderTopWidth: 5,
      borderTopColor: theme().color.success,
   },
   style_notification_badge_wrapper_warning: {
      borderTopWidth: 5,
      borderTopColor: theme().color.warning,
   },
   style_notification_badge_wrapper_info: {
      borderTopWidth: 5,
      borderTopColor: theme().color.info,
   },
   style_notification_badge_toggle: {
      width: 50,
      height: 5,
      borderRadius: 5 / 2,
      backgroundColor: theme().font.color,
      marginBottom: 10,
   },
   style_notification_badge_context: {
      flexDirection: "row",
      alignItems: "center",
   },
   style_notification_badge_content: {
      flex: 1,
   },
   style_notification_badge_content_title: {
      fontSize: 15,
      lineHeight: 21,
      color: theme().font.colorSecondary,
      fontFamily: "regular",
   },
   style_notification_badge_content_description: {
      fontSize: 13,
      marginTop: 4,
      color: theme().font.colorSecondary,
      opacity: 0.5,
      lineHeight: 18,
      fontFamily: "regular",
   },
   style_notification_badge_footer: {
      flexDirection: "row",
   },
   style_notification_badge_footer_item: {
      padding: 10,
      borderWidth: 0.5,
      borderColor: theme().color.secondaryBorder,
      backgroundColor: theme().color.primary,
      marginTop: 15,
      flex: 1,
      marginLeft: 0,
      paddingHorizontal: 20,
      borderRadius: 39 / 2,
      height: 39,
      justifyContent: "center",
   },
   style_notification_badge_footer_item_cancel: {
      padding: 10,
      flex: 1,
      alignSelf: "flex-end",
      marginTop: 15,
      marginRight: 10,
      marginLeft: 0,
      borderRadius: 39 / 2,
      height: 39,
      justifyContent: "center",
   },
   style_notification_badge_footer_item_text: {
      color: theme().font.colorSecondary,
      textAlign: "center",
      fontFamily: "bold",
   },
   style_notification_badge_footer_item_text_cancel: {
      color: theme().font.colorSecondary,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme().font.color,
      fontFamily: "bold",
   },
});
