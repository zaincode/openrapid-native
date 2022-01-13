import React from "react";
import { StyleSheet, ScrollView, TextInput, ActivityIndicator, Platform } from "react-native";
import { View } from "react-native-animatable";
import { theme } from "../configs/config_global";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import Text from "./component_text";
import Indicator from "./component_indicator";

function isValidHttpUrl(string) {
   var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
         "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
         "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
         "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
         "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
         "(\\#[-a-z\\d_]*)?$",
      "i"
   ); // fragment locator
   return !!pattern.test(string);
}
const InputText = (props) => {
   const inputRef = React.useRef(null);
   const [isSearching, setSearchinng] = React.useState(false);
   const [isFocused, setFocus] = React.useState(false);
   const [isDropdownVisible, setDropdownVisible] = React.useState(false);
   const [selectedDropdownValue, setDropdownValue] = React.useState(props.value);
   var searchTimeout = undefined;

   // Handle search data
   // Through JSON or array
   // If it specified from api the function will get called every 3 seconds
   const handleSearch = ({ nativeEvent }) => {
      const query = nativeEvent.text;
      if (props.data === undefined) {
         setSearchinng(true);
         if (searchTimeout) clearTimeout(searchTimeout);
         searchTimeout = setTimeout(async () => {
            if (props.onSearch !== undefined) {
               props.onSearch(query);
            }
            setSearchinng(false);
         }, 500);
      } else {
         if (props.data !== undefined && typeof props.data === "object") {
            const searchedData = props.data.filter((item) => {
               return item[props.search] == query;
            });
            if (props.onSearch !== undefined) {
               props.onSearch(searchedData);
            }
         }
      }
   };

   // Returns the typed value
   // If parameter passed, the value will then become customizeable
   const handleTypedValue = async (textVal) => {
      // Check if there is validation available
      var isValidated = {
         isValidating: props.validation !== undefined && typeof props.data === "object",
         email: false,
         link: false,
      };
      if (props.validation !== undefined) {
         // Loop through every validation scheme
         if (props.validation == "email") {
            const re =
               /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
            isValidated.email = re.test(String(textVal).toLowerCase());
         }
         if (props.validation == "link") {
            isValidated.link = isValidHttpUrl(textVal);
         }
      }
      if (isValidated) {
         if (props.onValidated !== undefined) {
            props.onValidated(isValidated);
         }
      }
      if (props.onChangeText !== undefined) {
         props.onChangeText(textVal);
      }
   };

   // Handle onpress dropdown input
   const handlePressDropdown = (evt) => {
      if (isDropdownVisible) {
         setDropdownVisible(false);
      } else {
         setDropdownVisible(true);
      }
   };

   // Handle pressing dropdown lists
   const handleSelectDropdown = (data) => {
      setDropdownVisible(false);
      setDropdownValue(data.label);
      if (props.onChangeText) {
         props.onChangeText(data);
      }
   };

   return (
      <React.Fragment>
         <View
            ref={inputRef}
            style={[
               style.input_container,
               props.containerStyle,
               props.autoMargin !== undefined
                  ? {
                       marginHorizontal: 15,
                       marginVertical: 7,
                    }
                  : false,
               props.padding !== undefined
                  ? {
                       padding: props.padding,
                    }
                  : false,
               props.shape !== undefined && props.shape == "round"
                  ? style.input_container_rounded
                  : false,
               props.shape !== undefined && props.shape == "underline"
                  ? style.input_container_underline
                  : false,
               props.transparent !== undefined && props.transparent === true
                  ? {
                       backgroundColor: "transparent",
                       paddingHorizontal: 0,
                    }
                  : false,
               isFocused && props.highlightOnFocus !== undefined && props.highlightOnFocus == true
                  ? props.shape === "underline"
                     ? {
                          borderBottomColor: theme().color.primary,
                       }
                     : {
                          borderColor: theme().color.primary,
                       }
                  : false,
               props.indicator !== undefined && props.indicator == "error"
                  ? {
                       borderColor: theme().color.error,
                    }
                  : false,
               props.indicator !== undefined && props.indicator == "success"
                  ? {
                       borderColor: theme().color.success,
                    }
                  : false,
               props.multiline !== undefined
                  ? {
                       height: "auto",
                    }
                  : false,
            ]}
         >
            {props.icon !== undefined ? (
               <View style={style.input_icon}>
                  {typeof props.icon === "object" ? (
                     <React.Fragment>
                        {props.icon !== undefined && props.icon.name !== undefined ? (
                           <Ionicons
                              name={props.icon.name}
                              size={props.icon.size !== undefined ? props.icon.size : 17}
                              color={
                                 props.icon.color !== undefined
                                    ? props.icon.color
                                    : theme().font.color
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
            {props.renderIcon !== undefined ? <View>{props.renderIcon}</View> : false}
            {props.rendeLeft !== undefined ? props.renderLeft : false}
            <View style={{ flex: 1 }}>
               {isFocused && props.placeholder !== undefined ? (
                  <Animatable.Text
                     animation="slideInUp"
                     duration={250}
                     useNativeDriver
                     style={style.input_label}
                  >
                     {props.placeholder}
                  </Animatable.Text>
               ) : props.value !== undefined && props.value != "" ? (
                  <Animatable.Text
                     animation="slideInUp"
                     duration={300}
                     useNativeDriver
                     style={style.input_label}
                  >
                     {props.placeholder}
                  </Animatable.Text>
               ) : (
                  false
               )}
               {props.type == undefined || props.type == "text" ? (
                  <TextInput
                     autoCapitalize="none"
                     onFocus={() => setFocus(true)}
                     onBlur={() => setFocus(false)}
                     placeholderTextColor={theme().input.placeHolderColor}
                     searchData={props.searchData}
                     style={[style.input_field, props.style]}
                     onChange={props.onSearch !== undefined ? handleSearch : undefined}
                     onChangeText={handleTypedValue}
                     {...props}
                     placeholder={
                        isFocused || (props.value !== undefined && props.value != "")
                           ? ""
                           : props.placeholder
                     }
                  />
               ) : (
                  false
               )}
               {props.type !== undefined && props.type == "dropdown" ? (
                  <TouchableOpacity
                     searchData={props.searchData}
                     style={[style.input_field, props.style, style.input_dropdown]}
                     onChange={props.onSearch !== undefined ? handleSearch : undefined}
                     onChangeText={handleTypedValue}
                     {...props}
                     onPress={handlePressDropdown}
                  >
                     <Text
                        style={[
                           style.input_field,
                           {
                              color:
                                 selectedDropdownValue !== undefined
                                    ? theme().color.font
                                    : theme().input.placeHolderColor,
                              fontFamily: "regular",
                           },
                        ]}
                     >
                        {selectedDropdownValue !== undefined
                           ? selectedDropdownValue
                           : props.placeholder}
                     </Text>
                  </TouchableOpacity>
               ) : (
                  false
               )}
            </View>

            <Indicator type={props.indicator} />

            {props.type !== undefined && props.type == "dropdown" ? (
               <Animatable.View animation="fadeInUp" duration={100}>
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={handlePressDropdown}>
                     <Ionicons
                        name={isDropdownVisible ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={theme().color.font}
                     />
                  </TouchableOpacity>
               </Animatable.View>
            ) : (
               false
            )}
            {props.renderRight !== undefined ? props.renderRight : false}
            {isSearching ? <ActivityIndicator size={"small"} /> : false}
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
         </View>
         {isDropdownVisible == true && props.data !== undefined ? (
            <Animatable.View>
               <ScrollView
                  style={[
                     style.input_dropdown_container,
                     props.autoMargin !== undefined
                        ? {
                             margin: 15,
                          }
                        : false,
                  ]}
               >
                  {props.data.map((item, index) => {
                     return (
                        <TouchableOpacity
                           key={index.toString()}
                           onPress={() => handleSelectDropdown(item)}
                           style={style.input_dropdown_list}
                        >
                           <Ionicons
                              name="ios-caret-forward-outline"
                              size={12}
                              color={theme().color.font}
                              style={{
                                 marginRight: 10,
                                 opacity: 0.8,
                              }}
                           />
                           <Text numberOfLine={1} style={style.input_dropdown_list_text}>
                              {item.label}
                           </Text>
                        </TouchableOpacity>
                     );
                  })}
               </ScrollView>
            </Animatable.View>
         ) : (
            false
         )}
      </React.Fragment>
   );
};

export default React.memo(InputText);

const style = StyleSheet.create({
   input_container: {
      flexDirection: "row",
      alignItems: "center",
      height: theme().input.height,
      backgroundColor: theme().input.backgroundColor,
      borderRadius: 5,
      padding: 10,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme().color.border,
   },
   input_container_rounded: {
      borderRadius: theme().input.height / 2,
      paddingHorizontal: 15,
   },
   input_container_underline: {
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme().input.borderColor,
   },
   input_field: {
      fontSize: theme().font.size,
      color: theme().font.color,
      fontFamily: "regular",
   },
   input_dropdown: {
      height: 40,
      justifyContent: "center",
   },
   input_label: {
      fontSize: Platform.OS == "ios" ? 12 : 12.4,
      fontFamily: "regular",
      color: theme().input.placeHolderColor,
      marginBottom: Platform.OS === "android" ? -3 : 4,
      marginTop: Platform.OS === "android" ? 5 : 2,
      marginLeft: 1,
   },
   input_icon: {
      marginRight: 10,
      borderRightWidth: 1,
      borderRightColor: theme().color.border,
      paddingRight: 10,
      height: theme().input.height - 25,
      justifyContent: "center",
      alignItems: "center",
   },
   input_dropdown_container: {
      backgroundColor: "white",
      maxHeight: 175,
      marginTop: 0,
      elevation: 1,
      borderColor: theme().color.border,
      borderWidth: 0.5,
      borderRadius: 5,
   },
   input_dropdown_list: {
      padding: 15,
      flexDirection: "row",
      // paddingLeft: 50,
      borderBottomWidth: 1,
      borderBottomColor: theme().color.border,
   },
   input_dropdown_list_text: {
      fontFamily: "regular",
      color: theme().color.font,
      fontSize: theme().font.size,
   },
});
