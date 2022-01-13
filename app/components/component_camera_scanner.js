import React from "react";
import {
   View,
   Dimensions,
   StyleSheet,
   Animated,
   Text,
   ActivityIndicator,
   TouchableOpacity,
   Platform,
} from "react-native";
import { Camera } from "expo-camera";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { Log } from "./component_report";
const pkg = Constants.manifest.releaseChannel
   ? Constants.manifest.android.package // When published, considered as using standalone build
   : undefined; // In expo client mode
import { BarCodeScanner } from "expo-barcode-scanner";

export default (props) => {
   const [hasPermission, setHasPermission] = React.useState(null);
   const [isBarcodeScanned, setBarcodeScanned] = React.useState(false);
   const [isCameraReady, setCameraStatus] = React.useState(false);
   const [boxSize, setBoxSize] = React.useState({
      width: 200,
      height: 200,
   });
   const [threshold, setThreshold] = React.useState(50);
   const scanningAnimation = React.useRef(new Animated.Value(0)).current;
   const cameraRef = React.useRef();

   React.useEffect(() => {
      (async () => {
         const { status } = await Camera.requestCameraPermissionsAsync();
         setHasPermission(status === "granted");
         if (props.size !== undefined) {
            if (typeof props.size == "number") {
               setBoxSize({
                  width: props.size,
                  height: props.size,
               });
            } else {
               setBoxSize({
                  width: props.size.width,
                  height: props.size.height,
               });
            }
         }
         if (props.threshold !== undefined) {
            setThreshold(props.threshold);
         }
         Animated.loop(
            Animated.timing(scanningAnimation, {
               toValue: props.size.height + 10,
               duration: 1400,
               useNativeDriver: false,
            })
         ).start();
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

   const handleOnCameraReady = async () => {
      setCameraStatus(true);
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

   const handleReturnScannedCode = (response) => {
      setBarcodeScanned(true);
      scanningAnimation.stopAnimation();
      if (props.onScanned !== undefined) props.onScanned(response.data, response);
   };

   const handleBarcodeScanned = async (response) => {
      if (isBarcodeScanned == false) {
         if (props.precise !== undefined && props.precise == true && Platform.OS == "ios") {
            if (
               response.bounds.size.width > boxSize.width - threshold &&
               response.bounds.size.height > boxSize.height - threshold
            ) {
               handleReturnScannedCode(response);
            }
         } else {
            handleReturnScannedCode(response);
         }
      } else {
         if (props.multiple !== undefined && props.multiple == true && Platform.OS == "ios") {
            if (props.precise !== undefined && props.precise == true && Platform.OS == "ios") {
               if (
                  response.bounds.size.width > boxSize.width - threshold &&
                  response.bounds.size.height > boxSize.height - threshold
               ) {
                  handleReturnScannedCode(response);
               }
            } else {
               handleReturnScannedCode(response);
            }
         }
      }
   };

   const renderScannerContent = () => {
      return (
         <React.Fragment>
            {props.header !== undefined ? (
               props.header
            ) : (
               <React.Fragment>
                  <View style={style.camera_background}></View>
                  <Text style={[style.camera_text]}>Scan your QR Code</Text>
                  <Text style={[style.camera_text_description, { marginBottom: 30 }]}>
                     Make sure to point the scanner exactly at the QR Code
                  </Text>
               </React.Fragment>
            )}
            <View style={[style.camera_overlap, { width: boxSize.width, height: boxSize.height }]}>
               {isBarcodeScanned && props.renderBarcodeScanned !== undefined
                  ? props.renderBarcodeScanned
                  : false}
               {isBarcodeScanned == false ? (
                  <Animated.View
                     style={[
                        {
                           position: "absolute",
                           backgroundColor: "rgba(0,0,0,0.2)",
                           width: boxSize.width,
                           height: boxSize.height + 50,
                           borderTopWidth: 5,
                           borderTopColor: "white",
                           top: scanningAnimation,
                        },
                     ]}
                  />
               ) : (
                  false
               )}
            </View>
            {props.footer !== undefined ? props.footer : false}
         </React.Fragment>
      );
   };

   return (
      <View style={style.camera_container} {...props}>
         {Platform.OS == "ios" ? (
            <BarCodeScanner
               ref={cameraRef}
               flash={Camera.Constants.FlashMode.on}
               ratio={"16:9"}
               onBarCodeScanned={handleBarcodeScanned}
               style={[StyleSheet.absoluteFillObject, style.camera]}
               onCameraReady={handleOnCameraReady}
               onMountError={handleErrorCamera}
               barCodeTypes={[
                  props.type !== undefined
                     ? BarCodeScanner.Constants.BarCodeType[props.type]
                     : BarCodeScanner.Constants.BarCodeType.qr,
               ]}
            >
               {renderScannerContent()}
            </BarCodeScanner>
         ) : (
            <Camera
               ref={cameraRef}
               flash={Camera.Constants.FlashMode.on}
               ratio={"16:9"}
               onBarCodeScanned={handleBarcodeScanned}
               style={[StyleSheet.absoluteFillObject, style.camera]}
               onCameraReady={handleOnCameraReady}
               onMountError={handleErrorCamera}
               barCodeTypes={[
                  props.type !== undefined
                     ? BarCodeScanner.Constants.BarCodeType[props.type]
                     : BarCodeScanner.Constants.BarCodeType.qr,
               ]}
            >
               {renderScannerContent()}
            </Camera>
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
      backgroundColor: "black",
   },
   camera_background: {
      backgroundColor: "rgba(0,0,0,0.4)",
      position: "absolute",
      width: "100%",
      height: "100%",
   },
   camera_overlap: {
      borderRadius: 10,
      width: 0,
      height: 0,
      backgroundColor: "rgba(255,255,255,0.2)",
      overflow: "hidden",
      zIndex: 10,
   },
   camera: {
      flex: 1,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      justifyContent: "center",
      alignItems: "center",
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
   camera_flash_btn: {
      height: 40,
      flexDirection: "row",
      backgroundColor: "rgb(250,250,250)",
      borderRadius: 40 / 2,
      paddingHorizontal: 20,
      marginTop: 50,
      alignItems: "center",
      justifyContent: "center",
   },
});
