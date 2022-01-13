import React from "react";
import {
   View,
   StyleSheet,
   ActivityIndicator,
   Image,
   TouchableOpacity,
   Text,
   Dimensions,
   Platform,
} from "react-native";
import { theme } from "../configs/config_global";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { SliderBox } from "react-native-image-slider-box";
import Center from "./component_center";

export default (props) => {
   const [mediaType, setMediaType] = React.useState("image");
   const [imageURL, setImageURL] = React.useState([]);
   const [currentSelectedImageIndex, setCurrentSelectedImageIndex] = React.useState(0);
   const [isDownloadingImage, setDownloadingImage] = React.useState(false);
   const [status, requestPermission] = MediaLibrary.usePermissions();
   const [isCameraRollPermited, setCamaeraRollPermition] = React.useState(false);

   React.useEffect(() => {
      (async () => {
         setMediaType(props.type);
         setImageURL(props.source);
      })();
   }, [props]);

   const handleDownloadImage = async () => {
      const cameraRollPermissions = await requestPermission();
      setCamaeraRollPermition(cameraRollPermissions.status === "granted");
      if (props.onDownloadPermissionChange) {
         props.onDownloadPermissionChange(false);
      }
      if (cameraRollPermissions.status === "granted") {
         setDownloadingImage(true);
         const selectedImageUrl =
            typeof imageURL === "string" ? imageURL : imageURL[currentSelectedImageIndex];
         const imageName = selectedImageUrl.substr(selectedImageUrl.lastIndexOf("/") + 1);
         await FileSystem.downloadAsync(selectedImageUrl, FileSystem.documentDirectory + imageName)
            .then(async ({ uri }) => {
               if (props.downloadStatus) {
                  props.downloadStatus(true);
               }
               try {
                  // Save downloaded image to camera roll
                  await MediaLibrary.saveToLibraryAsync(uri);
                  // Delete downloaded image
                  await FileSystem.deleteAsync(uri);

                  if (props.onImageSaved) {
                     props.onImageSaved(true);
                  }

                  setDownloadingImage(false);
               } catch (e) {
                  if (props.onImageSaved) {
                     props.onImageSaved(false);
                  }
                  setDownloadingImage(false);
               }
            })
            .catch((error) => {
               if (props.downloadStatus) {
                  props.downloadStatus(false);
               }
               setDownloadingImage(false);
            });
      }
   };

   return (
      <View style={style.media_container} {...props}>
         {props.customHeader !== undefined ? props.customHeader : false}

         {props.customHeader === undefined ? (
            <View style={style.image_header}>
               <TouchableOpacity
                  onPress={props.onGoBack !== undefined ? props.onGoBack : undefined}
               >
                  <AntDesign name="arrowleft" size={22} color="white" />
               </TouchableOpacity>
               <View
                  style={{
                     justifyContent: "center",
                     alignItems: "center",
                     alignSelf: "center",
                     flex: 1,
                     marginHorizontal: 15,
                  }}
               >
                  <Text numberOfLines={1} style={[style.image_text, { fontWeight: "bold" }]}>
                     {props.header !== undefined && props.header.title !== undefined
                        ? props.header.title
                        : false}
                  </Text>
                  {props.header !== undefined && props.header.description !== undefined ? (
                     <Text
                        numberOfLines={1}
                        style={[style.image_text_description, { marginTop: 2 }]}
                     >
                        {props.header.description}
                     </Text>
                  ) : null}
               </View>
               <View style={{ minWidth: 22 }}>
                  {props.download !== undefined ? (
                     <React.Fragment>
                        {isDownloadingImage ? (
                           <ActivityIndicator size="small" color="white" />
                        ) : (
                           <TouchableOpacity onPress={handleDownloadImage}>
                              <Feather name="download" size={21} color="white" />
                           </TouchableOpacity>
                        )}
                     </React.Fragment>
                  ) : (
                     false
                  )}
                  {props.renderRightItem !== undefined ? props.renderRightItem : false}
               </View>
            </View>
         ) : (
            false
         )}
         {props.source !== undefined ? (
            <Center>
               {typeof props.source === "string" ? (
                  <Image
                     resizeMode="contain"
                     source={
                        typeof imageURL == "string"
                           ? {
                                uri: imageURL,
                             }
                           : undefined
                     }
                     style={{
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        flex: 1,
                     }}
                  />
               ) : (
                  <React.Fragment>
                     <SliderBox
                        resizeMode="contain"
                        images={imageURL}
                        dotColor="#FFEE58"
                        inactiveDotColor="rgba(240, 240, 240, 0.3)"
                        {...props.sliderProps}
                        sliderBoxHeight={Dimensions.get("window").height}
                        imageLoadingColor="white"
                        paginationBoxVerticalPadding={Platform.OS == "ios" ? 30 : 10}
                        currentImageEmitter={(index) => setCurrentSelectedImageIndex(index)}
                     />
                  </React.Fragment>
               )}
            </Center>
         ) : (
            false
         )}
      </View>
   );
};

const style = StyleSheet.create({
   media_container: {
      flex: 1,
      backgroundColor: "rgb(10,10,10)",
   },
   image_header: {
      backgroundColor: "rgb(0,0,0)",
      position: "absolute",
      width: Dimensions.get("screen").width,
      top: 0,
      paddingTop: theme().statusBar.height + 5,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 15,
      zIndex: 1,
      height: 100,
   },
   image_text: {
      fontSize: 14,
      color: "white",
      opacity: 1,
   },
   image_text_description: {
      marginTop: 5,
      fontSize: 13,
      color: "white",
      opacity: 0.5,
      lineHeight: 18,
      maxWidth: "60%",
      textAlign: "center",
   },
});
