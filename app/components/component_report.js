import React from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList, View } from "react-native";
import { theme, debug } from "../configs/config_global";
import * as FileSystem from "expo-file-system";
import { setStatusBarStyle } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
const moment = require("moment");
const fileUri = FileSystem.documentDirectory + "or_saved_device_logs.json";

// Store logs into device system in a file (optional)
export const Store = async (message, type = "", tag = null) => {
   const debugContent = {
      message: message,
      type: type,
      tag: tag,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
   };
   var fileContent = null;
   const dirInfo = await FileSystem.getInfoAsync(fileUri);
   if (dirInfo.exists == true) {
      const readExistingFile = await FileSystem.readAsStringAsync(fileUri);
      fileContent = JSON.parse(readExistingFile);
      fileContent.push(debugContent);
   } else {
      fileContent = [debugContent];
   }
   await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(fileContent));
};

export const Log = async (message, options = {}) => {
   if (debug == true) {
      if (options.tag !== undefined) {
         console.log(message, options.tag);
      } else {
         console.log(message);
      }
      if (options.save !== undefined && options.save === true)
         await Store(message, "", options.tag !== undefined ? options.tag : null);
   }
};

export const Error = async (message, options = {}) => {
   if (debug == true) {
      if (options.tag !== undefined) {
         console.error(message, options.tag);
      } else {
         console.error(message);
      }
      if (options.save !== undefined && options.save == true)
         await Store(message, "error", options.tag !== undefined ? options.tag : null);
   }
};

export const Warning = async (message, options = {}) => {
   if (debug == true) {
      if (options.tag !== undefined) {
         console.warn(message, options.tag);
      } else {
         console.warn(message);
      }
      if (options.save !== undefined && options.save === true)
         await Store(message, "warning", options.tag !== undefined ? options.tag : null);
   }
};

// Clear Device Saved Logs
export const Clear = async () => {
   await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
};

// Fetch device logs
export const Fetch = async () => {
   const dirInfo = await FileSystem.getInfoAsync(fileUri);
   if (dirInfo.exists == true) {
      const readExistingFile = await FileSystem.readAsStringAsync(fileUri);
      fileContent = JSON.parse(readExistingFile);
      return fileContent;
   } else {
      console.log("There are no device log available");
   }
};

// Fetch device logs
export const Display = () => {
   const [data, setData] = React.useState([]);

   const backgroundColor = {
      warning: "#f0932b",
      error: "#c23616",
      "": "#718093",
   };

   const textColor = {
      warning: "#f0932b",
      error: "#c23616",
      "": "black",
   };

   React.useEffect(() => {
      (async () => {
         const data = await Fetch();
         setData(data.reverse());
         setStatusBarStyle("dark");
      })();
   }, []);

   const renderLogData = (item) => {
      if (typeof item.data === "string") {
         return <Text style={style.log_item_data}>{item.data}</Text>;
      } else if (typeof item.data === "object") {
         return <Text style={style.log_item_data}>{JSON.stringify(item.data)}</Text>;
      }
   };

   return (
      <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
         <View style={style.report_header}>
            <Text style={style.report_header_title}>Device Report</Text>
         </View>
         <FlatList
            style={{ flex: 1 }}
            data={data}
            renderItem={({ item, index }) => (
               <TouchableOpacity
                  onPress={() => {
                     Clipboard.setString(item.message);
                     alert("Log Message Copied to Clipboard");
                  }}
                  style={[
                     style.log_item,
                     { borderLeftWidth: 5, borderLeftColor: backgroundColor[item.type] },
                  ]}
               >
                  <View style={style.log_item_header}>
                     <View>
                        <Text style={[style.log_item_date]}>
                           {moment(item.timestamp).fromNow()}
                        </Text>
                     </View>
                     <View style={{ marginBottom: 5 }} />
                     {item.tag !== undefined && item.tag !== null ? (
                        <React.Fragment>
                           <View style={{ marginVertical: 5 }}>
                              <Text
                                 style={[style.log_item_date, { fontWeight: "bold", opacity: 1 }]}
                              >
                                 {item.tag}
                              </Text>
                           </View>
                        </React.Fragment>
                     ) : (
                        false
                     )}
                     <View>
                        <Text
                           style={[
                              style.log_item_title,
                              { color: textColor[item.type], opacity: 0.8 },
                           ]}
                        >
                           {item.message}
                        </Text>
                     </View>
                  </View>
               </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews
         />
      </View>
   );
};

const style = StyleSheet.create({
   log_item: {
      padding: 15,
      backgroundColor: "white",
   },
   log_item_header: {},
   log_item_title: {
      lineHeight: 22,
      fontSize: 14,
   },
   log_item_date: {
      fontSize: 12,
      opacity: 0.5,
   },
   log_item_data: {
      fontSize: 14,
      opacity: 0.8,
      marginTop: 5,
   },
   report_header: {
      padding: 15,
      paddingVertical: 20,
      backgroundColor: "white",
      flexDirection: "row",
      paddingTop: theme().statusBar.height + 5,
      borderBottomWidth: 1,
      borderBottomColor: "rgb(230,230,230)",
   },
   report_header_title: {
      fontFamily: "bold",
      fontSize: 17,
   },
});
