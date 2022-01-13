import React from "react";
import {
   View,
   AppState,
   Dimensions,
   ScrollView,
   StyleSheet,
   Text,
   ActivityIndicator,
   PanResponder,
   Image,
   Platform,
} from "react-native";
import { theme } from "../configs/config_global";
import { Camera } from "expo-camera";
import * as IntentLauncher from "expo-intent-launcher";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import * as Animatable from "react-native-animatable";
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Log } from "./component_report";
const pkg = Constants.manifest.releaseChannel
   ? Constants.manifest.android.package // When published, considered as using standalone build
   : undefined; // In expo client mode
import ImageViewer from "./component_image_preview";

class ZoomView extends React.Component {
   constructor(props) {
      super(props);
      this._panResponder = PanResponder.create({
         onPanResponderMove: (e, { dy }) => {
            const { height: windowHeight } = Dimensions.get(`window`);
            return this.props.onZoomProgress(Math.min(Math.max((dy * -1) / windowHeight, 0), 1));
         },
         onMoveShouldSetPanResponder: (ev, { dx }) => {
            return dx !== 0;
         },
         onPanResponderGrant: () => {
            return this.props.onZoomStart();
         },
         onPanResponderRelease: () => {
            return this.props.onZoomEnd();
         },
      });
   }
   render() {
      return (
         <View
            style={{
               flex: 1,
               width: `100%`,
               ...this.props.style,
            }}
            {...this._panResponder.panHandlers}
         >
            {this.props.children}
         </View>
      );
   }
}

export default (props) => {
   const appState = React.useRef(AppState.currentState);
   const [hasPermission, setHasPermission] = React.useState(null);
   const [type, setType] = React.useState(Camera.Constants.Type.back);
   const [isCameraReady, setCameraStatus] = React.useState(false);
   const [cameraSize, setCameraAvailableSize] = React.useState([]);
   const [isTakingPicture, setTakingPicutre] = React.useState(false);
   const [picture, setPicture] = React.useState(null);
   const [isCameraOptionOpened, setCameraOption] = React.useState(false);
   // Camera Flash Mode
   const [isFlashOn, setFlash] = React.useState(false);
   const [isAutoFocusOn, setAutoFocus] = React.useState(true);
   // Camera Zoom
   const [cameraZoom, setCameraZoom] = React.useState(0);
   const [isZoomLabelVisible, setZoomLabelVisible] = React.useState(0);
   const [zoomLabelTimeout, setZoomLabelTimeout] = React.useState(null);
   // Camera Ratio
   const [selectedRatio, setCameraRatio] = React.useState(0);
   const [ratio] = React.useState(["16:9", "4:3", "1:1"]);
   // Camera Picture Quality
   const [selectedQuality, setQuality] = React.useState(0);
   const [qualities] = React.useState([
      {
         label: "Balanced",
         value: 0.5,
      },
      {
         label: "High",
         value: 1,
      },
      {
         label: "Low",
         value: 0.3,
      },
   ]);
   // White Balances
   const [selectedWhiteBalance, setWhiteBalance] = React.useState(0);
   const [whiteBalances] = React.useState([
      {
         label: "Auto",
         value: Camera.Constants.WhiteBalance.auto,
      },
      {
         label: "Sunny",
         value: Camera.Constants.WhiteBalance.sunny,
      },
      {
         label: "Cloudy",
         value: Camera.Constants.WhiteBalance.cloudy,
      },
      {
         label: "Shadow",
         value: Camera.Constants.WhiteBalance.shadow,
      },
      {
         label: "Fluorescent",
         value: Camera.Constants.WhiteBalance.fluorescent,
      },
      {
         label: "Incandescent",
         value: Camera.Constants.WhiteBalance.incandescent,
      },
   ]);

   const [isImagePreviewVisible, setImagePreviewVisible] = React.useState(false);
   const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
   const cameraRef = React.useRef();

   React.useEffect(() => {
      (async () => {
         const { status } = await Camera.requestCameraPermissionsAsync();
         setHasPermission(status === "granted");
      })();
   }, []);

   const handleOnOpenCameraSettings = () => {
      if (Platform.OS == "ios") {
         Linking.openURL("app-settings:");
      } else {
         IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
            {
               data: "package:" + pkg,
            }
         );
      }
   };

   const handleTakePicture = async () => {
      if (isCameraReady && isTakingPicture == false) {
         try {
            setPicture(null);
            setTakingPicutre(true);
            await cameraRef.current.takePictureAsync({
               quality:
                  props.pictureQuality !== undefined
                     ? props.pictureQuality
                     : qualities[selectedQuality].value,
               onPictureSaved: handleOnPictureSaved,
               ...props.pictureOptions,
            });
         } catch (e) {
            Log(e);
            setTakingPicutre(false);
         }
      }
   };

   const handleOnPictureSaved = (image) => {
      setTakingPicutre(false);
      if (props.onPictureTaken !== undefined) {
         props.onPictureTaken(image);
      } else {
         setPicture(image);
      }
   };

   const handleOnCameraReady = async () => {
      setCameraStatus(true);
      setCameraAvailableSize(await cameraRef.current.getAvailablePictureSizesAsync("16:9"));
   };

   const handleErrorCamera = (error) => {
      alert("There was an error when loading camera please make sure your device supported camera");
      Log(error);
   };

   const handleChangeCameraRatio = () => {
      setCameraRatio(selectedRatio < ratio.length - 1 ? selectedRatio + 1 : 0);
   };

   const handleChangePictureQuality = () => {
      setQuality(selectedQuality < qualities.length - 1 ? selectedQuality + 1 : 0);
   };

   const handleChangeWhiteBalance = () => {
      setWhiteBalance(
         selectedWhiteBalance < whiteBalances.length - 1 ? selectedWhiteBalance + 1 : 0
      );
   };

   const handleZoomCamera = (zoom) => {
      setCameraZoom(parseFloat(zoom).toFixed(2));
   };

   if (hasPermission === null) {
      return (
         <View style={style.camera_container} {...props}>
            <ActivityIndicator color="white" style={style.camera_text} size="small" />
         </View>
      );
   }

   if (hasPermission === false) {
      return (
         <View style={style.camera_container} {...props}>
            <Text style={style.camera_text}>No access to your camera</Text>
            <Text style={style.camera_text_description}>
               Make sure you have allowed camera access to this app
            </Text>
            <TouchableOpacity onPress={handleOnOpenCameraSettings} style={{ marginTop: 15 }}>
               <Text style={style.camera_text}>Open Settings</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <View style={style.camera_container} {...props}>
         {isImagePreviewVisible == false ? (
            <ZoomView
               onZoomStart={() => {
                  setZoomLabelTimeout(null);
                  clearTimeout(zoomLabelTimeout);
                  setZoomLabelVisible(true);
               }}
               onZoomEnd={() => {
                  setZoomLabelTimeout(
                     setTimeout(() => {
                        setZoomLabelVisible(false);
                        clearTimeout(zoomLabelTimeout);
                     }, 1300)
                  );
               }}
               onZoomProgress={(zoom) => handleZoomCamera(zoom)}
            >
               <Camera
                  ref={cameraRef}
                  flashMode={isFlashOn}
                  ratio={ratio[selectedRatio]}
                  whiteBalance={selectedWhiteBalance}
                  zoom={cameraZoom}
                  autoFocus={Camera.Constants.AutoFocus[isAutoFocusOn == true ? "on" : "off"]}
                  style={style.camera}
                  type={type}
                  onCameraReady={handleOnCameraReady}
                  onMountError={handleErrorCamera}
                  {...props}
               >
                  {props.customHeader !== undefined ? props.customHeader : false}

                  {props.customHeader === undefined ? (
                     <View style={style.camera_header}>
                        {props.onGoBack !== undefined ? (
                           <TouchableOpacity
                              onPress={props.onGoBack !== undefined ? props.onGoBack : undefined}
                           >
                              <AntDesign name="arrowleft" size={22} color="white" />
                           </TouchableOpacity>
                        ) : (
                           false
                        )}

                        <View
                           style={{
                              justifyContent: "center",
                              alignItems: "center",
                              alignSelf: "center",
                              flex: 1,
                              marginHorizontal: 15,
                           }}
                        >
                           <Text
                              numberOfLines={1}
                              style={[style.camera_text, { fontWeight: "bold" }]}
                           >
                              {props.header !== undefined && props.header.title !== undefined
                                 ? props.header.title
                                 : "Camera"}
                           </Text>
                           {props.header !== undefined && props.header.description !== undefined ? (
                              <Text
                                 numberOfLines={1}
                                 style={[style.camera_text_description, { marginTop: 2 }]}
                              >
                                 {props.header.description}
                              </Text>
                           ) : null}
                        </View>
                        <View></View>
                     </View>
                  ) : (
                     false
                  )}

                  <View style={style.camera_centered_content}>
                     {isZoomLabelVisible ? (
                        <Text style={[style.camera_text, { fontSize: 30 }]}>
                           {cameraZoom > 0 ? cameraZoom : false}
                        </Text>
                     ) : (
                        false
                     )}
                  </View>

                  {props.customFooter !== undefined ? props.customFooter : false}

                  {props.customFooter === undefined ? (
                     <React.Fragment>
                        <View style={style.camera_label_warning}>
                           {isFlashOn ? (
                              <Text style={style.camera_label_warning_text}>Flash turned ON</Text>
                           ) : (
                              <Text style={style.camera_label_warning_text}>Slide up to zoom</Text>
                           )}
                        </View>

                        <View style={style.camera_footer}>
                           <View style={style.camera_footer_left}>
                              {picture !== null ? (
                                 <Animatable.View animation={"fadeInRight"} duration={150}>
                                    <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
                                       <Image
                                          source={{
                                             uri: picture.uri,
                                          }}
                                          style={{
                                             width: 37,
                                             height: 37,
                                             borderRadius: 5,
                                          }}
                                          resizeMode="cover"
                                       />
                                    </TouchableOpacity>
                                 </Animatable.View>
                              ) : (
                                 false
                              )}
                           </View>
                           <TouchableOpacity
                              style={style.camera_footer_shutter}
                              onPress={handleTakePicture}
                           >
                              {isTakingPicture ? (
                                 <Animatable.View
                                    animation={"pulse"}
                                    iterationCount={"infinite"}
                                    duration={600}
                                    style={style.camera_shutter_btn}
                                 ></Animatable.View>
                              ) : (
                                 false
                              )}
                           </TouchableOpacity>
                           <View style={style.camera_footer_right}>
                              <TouchableOpacity
                                 onPress={() => {
                                    setType(
                                       type === Camera.Constants.Type.back
                                          ? Camera.Constants.Type.front
                                          : Camera.Constants.Type.back
                                    );
                                 }}
                              >
                                 <MaterialIcons name="refresh" size={40} color="white" />
                              </TouchableOpacity>
                           </View>
                        </View>
                     </React.Fragment>
                  ) : (
                     false
                  )}
               </Camera>
            </ZoomView>
         ) : (
            false
         )}
         {isImagePreviewVisible == false ? (
            <View style={style.camera_tool}>
               <ScrollView horizontal>
                  <TouchableOpacity
                     onPress={() => {
                        setFlash(!isFlashOn);
                     }}
                     style={style.camera_tool_list}
                  >
                     <Ionicons
                        name={isFlashOn == true ? "flash-sharp" : "flash-outline"}
                        size={15}
                        color="white"
                     />
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={() => {
                        setAutoFocus(!isAutoFocusOn);
                     }}
                     style={style.camera_tool_list}
                  >
                     <MaterialCommunityIcons
                        style={{ marginRight: 5 }}
                        name="focus-auto"
                        size={16}
                        color="white"
                     />
                     <Text style={style.camera_tool_list_text}>Auto Focus</Text>
                     <View
                        style={{ width: 1, backgroundColor: "rgba(220,220,220, 0.5)", height: 10 }}
                     />
                     <Text style={style.camera_tool_list_value}>
                        {isAutoFocusOn == true ? "On" : "Off"}
                     </Text>
                  </TouchableOpacity>

                  {Platform.OS === "android" ? (
                     <TouchableOpacity
                        onPress={handleChangeCameraRatio}
                        style={style.camera_tool_list}
                     >
                        <Text style={style.camera_tool_list_text}>Ratio</Text>
                        <View
                           style={{
                              width: 1,
                              backgroundColor: "rgba(220,220,220, 0.5)",
                              height: 10,
                           }}
                        />
                        <Text style={style.camera_tool_list_value}>{ratio[selectedRatio]}</Text>
                     </TouchableOpacity>
                  ) : (
                     false
                  )}

                  <TouchableOpacity
                     onPress={handleChangeWhiteBalance}
                     style={style.camera_tool_list}
                  >
                     <Text style={style.camera_tool_list_text}>White Balance</Text>
                     <View
                        style={{ width: 1, backgroundColor: "rgba(220,220,220, 0.5)", height: 10 }}
                     />
                     <Text style={style.camera_tool_list_value}>
                        {whiteBalances[selectedWhiteBalance].label}
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={handleChangePictureQuality}
                     style={style.camera_tool_list}
                  >
                     <Text style={style.camera_tool_list_text}>Quality</Text>
                     <View
                        style={{ width: 1, backgroundColor: "rgba(220,220,220, 0.5)", height: 10 }}
                     />
                     <Text style={style.camera_tool_list_value}>
                        {qualities[selectedQuality].label}
                     </Text>
                  </TouchableOpacity>

                  <View style={{ width: 20 }} />
               </ScrollView>
            </View>
         ) : (
            false
         )}
         {isImagePreviewVisible ? (
            <ImageViewer
               onGoBack={() => setImagePreviewVisible(false)}
               header={{
                  title: "Camera Preview",
               }}
               source={picture.uri}
               renderRightItem={
                  <TouchableOpacity
                     onPress={() => {
                        if (props.handleOnImagePreviewButtonPressed !== undefined) {
                           props.handleOnImagePreviewButtonPressed(picture);
                        }
                     }}
                  >
                     <AntDesign name="check" size={22} color="white" />
                  </TouchableOpacity>
               }
            />
         ) : (
            false
         )}
      </View>
   );
};

const style = StyleSheet.create({
   camera_container: {
      flex: 1,
      justifyContent: "center",
      overflow: "hidden",
      alignItems: "center",
   },
   camera: {
      flex: 1,
      width: Dimensions.get("screen").width,
   },
   camera_text: {
      fontSize: 14,
      color: "white",
      opacity: 1,
   },
   camera_text_description: {
      marginTop: 5,
      fontSize: 13,
      color: "white",
      opacity: 0.5,
      lineHeight: 18,
      maxWidth: "60%",
      textAlign: "center",
   },
   camera_header: {
      position: "absolute",
      width: Dimensions.get("screen").width,
      top: 0,
      paddingTop: theme().statusBar.height,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 15,
      zIndex: 1,
      height: 100,
   },
   camera_footer: {
      position: "absolute",
      // backgroundColor: "rgba(0,0,0,02)",
      width: Dimensions.get("screen").width,
      bottom: 0,
      paddingBottom: 40,
      paddingTop: 25,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 30,
   },
   camera_footer_shutter: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
      borderWidth: 5,
      borderColor: "white",
   },
   camera_shutter_btn: {
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
      backgroundColor: "white",
   },
   camera_footer_left: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
   },
   camera_footer_right: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-end",
   },
   camera_label_warning: {
      position: "absolute",
      bottom: 140,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      textAlign: "center",
   },
   camera_label_warning_text: {
      fontSize: 13,
      color: "white",
      opacity: 0.7,
      lineHeight: 18,
      textAlign: "center",
   },
   camera_option: {
      position: "absolute",
      right: 0,
      backgroundColor: "rgb(250,250,250)",
      width: 100,
      borderRadius: 5,
      marginTop: 50,
   },
   camera_option_list: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgb(230,230,230)",
   },
   camera_option_list_label: {
      fontSize: 12,
      flex: 1,
   },
   camera_option_list_value: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 3,
   },
   camera_centered_content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
   },
   camera_tool: {
      backgroundColor: "black",
      height: Platform.OS == "ios" ? 85 : 60,
      width: "100%",
   },
   camera_tool_list: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 15,
      alignItems: "center",
      backgroundColor: "rgb(30,30,30)",
      height: 30,
      paddingHorizontal: 15,
      borderRadius: 40 / 2,
      marginLeft: 15,
   },
   camera_tool_list_text: {
      color: "white",
      fontSize: 13,
      opacity: 0.5,
      marginRight: 10,
   },
   camera_tool_list_value: {
      fontSize: 13,
      color: "white",
      marginLeft: 10,
      fontWeight: "bold",
   },
});
