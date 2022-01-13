import React from "react";
import {
   View,
   PixelRatio,
   Image,
   AppState,
   StyleSheet,
   Text,
   ActivityIndicator,
   Platform,
} from "react-native";
import { Camera } from "expo-camera";
import * as IntentLauncher from "expo-intent-launcher";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
const pkg = Constants.manifest.releaseChannel
   ? Constants.manifest.android.package // When published, considered as using standalone build
   : undefined; // In expo client mode
import * as FaceDetector from "expo-face-detector";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Log } from "./component_report";
import { Flip } from "./component_image_manipulator";
import ViewShot from "react-native-view-shot";

const shuffle = (array) => {
   let currentIndex = array.length,
      randomIndex;

   // While there remain elements to shuffle...
   while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
   }

   return array;
};

export default (props) => {
   const appState = React.useRef(AppState.currentState);
   const [hasPermission, setHasPermission] = React.useState(null);
   const [type, setType] = React.useState(Camera.Constants.Type.back);
   const [isCameraReady, setCameraStatus] = React.useState(false);
   const [isCameraLoaded, setCameraLoad] = React.useState(true);
   const [isTakingPicture, setTakingPicutre] = React.useState(false);
   const [picture, setPicture] = React.useState(null);
   const [face, setFace] = React.useState(null);
   const [faceVerifications, setFaceVerifications] = React.useState(
      props.detect !== undefined ? props.detect : []
   );
   const [motionVerified, setVerifiedMotion] = React.useState([]);
   const [isVerifying, setVerifying] = React.useState(false);
   const [backgroundColor, setBackgroundColor] = React.useState("white");
   const [isNoseTouchesLeftSide, setNoseTouchLeftSide] = React.useState(false);
   const [isNoseTouchesRightSide, setNoseTouchRightSide] = React.useState(false);
   const [noseBasePosition, setNoseBasePosition] = React.useState({
      x: -10,
      y: -10,
   });
   const cameraRef = React.useRef();
   const cameraConntainerRef = React.useRef();
   const viewShot = React.useRef();

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
      if (isCameraReady) {
         try {
            if (Platform.OS == "ios") {
               setPicture(null);
               setTakingPicutre(true);
               await cameraRef.current.takePictureAsync({
                  quality: props.pictureQuality !== undefined ? props.pictureQuality : 1,
                  onPictureSaved: async (image) => {
                     if (Platform.OS == "ios") {
                        image = await Flip(image.uri, "horizontal");
                     }
                     setTakingPicutre(false);
                     if (props.onPictureTaken !== undefined) {
                        props.onPictureTaken(image.uri);
                     }
                     if (
                        props.displayPictureOnCompleted !== undefined ||
                        props.displayPictureOnCompleted == true
                     ) {
                        setPicture(image.uri);
                     }
                  },
                  ...props.pictureOptions,
               });
            } else {
               viewShot.current.capture().then((uri) => {
                  setTakingPicutre(false);
                  if (props.onPictureTaken !== undefined) {
                     props.onPictureTaken(uri);
                  }
                  if (
                     props.displayPictureOnCompleted !== undefined ||
                     props.displayPictureOnCompleted == true
                  ) {
                     setPicture(uri);
                  }
               }),
                  (error) => Log(error);
            }
         } catch (e) {
            Log(e);
            setTakingPicutre(false);
         }
      }
   };

   const handleOnCameraReady = async () => {
      setCameraStatus(true);
   };

   const handleErrorCamera = (error) => {
      Log("There was an error when loading camera please make sure your device supported camera");
      Log(error);
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
               Make sure you have allowed camera access to this feature
            </Text>
            <TouchableOpacity onPress={handleOnOpenCameraSettings} style={{ marginTop: 15 }}>
               <Text style={style.camera_text}>Open Settings</Text>
            </TouchableOpacity>
         </View>
      );
   }

   const handleOnDetectFaces = ({ faces }) => {
      // Check if there are face detected on the camera
      if (faces.length > 0) {
         setNoseBasePosition(faces[0].noseBasePosition);
         setFace(faces[0]);
         if (motionVerified.length !== faceVerifications.length) {
            // Smile Detection
            if (faceVerifications[motionVerified.length] == "smile") {
               handleDetectSmile(faces[0]);
            }
            // Blinking Detection
            if (faceVerifications[motionVerified.length] == "blink") {
               handleDetectBlink(faces[0]);
            }
            // Head nose Detection
            if (faceVerifications[motionVerified.length] == "nose") {
               handleDetectnose(faces[0]);
            }
         }
      } else {
         setFace(null);
         setNoseBasePosition({
            x: -10,
            y: -10,
         });
      }
   };

   const handleDetectSmile = (face) => {
      // Verify smiling detection
      if (!motionVerified.includes("smile")) {
         if (parseFloat(face.smilingProbability) > 0.98) {
            setVerifiedMotion((prevArray) => [...prevArray, "smile"]);
            if (props.takePicture !== undefined || props.takePicture == true) {
               handleTakePicture();
            }
         }
      }
   };

   const handleDetectBlink = (face) => {
      if (!motionVerified.includes("blink")) {
         // Verify smiling detection
         const leftEyeOpenProbability = parseInt(face.leftEyeOpenProbability * 100);
         const rightEyeOpenProbability = parseInt(face.rightEyeOpenProbability * 100);
         if (
            // Make sure to detect blink when not smiling
            parseFloat(face.smilingProbability) < 0.3 &&
            parseInt(leftEyeOpenProbability) <= 1 &&
            parseInt(rightEyeOpenProbability) <= 1
         ) {
            setVerifiedMotion((prevArray) => [...prevArray, "blink"]);
            if (props.takePicture !== undefined || props.takePicture == true) {
               handleTakePicture();
            }
         }
      }
   };

   const handleDetectnose = (face) => {
      const threshold = 10;
      if (isNoseTouchesRightSide == false) {
         if (face.noseBasePosition.x > face.bounds.size.width - threshold) {
            setNoseTouchRightSide(true);
         }
      }

      if (isNoseTouchesLeftSide == false) {
         if (face.noseBasePosition.x <= threshold) {
            setNoseTouchLeftSide(true);
         }
      }

      if (isNoseTouchesLeftSide == true && isNoseTouchesRightSide == true) {
         setVerifiedMotion((prevArray) => [...prevArray, "nose"]);
         if (props.takePicture !== undefined || props.takePicture == true) {
            handleTakePicture();
         }
      }
   };

   const handleOnProgressChange = async (progress) => {
      if (props.onProgress !== undefined) {
         props.onProgress(progress);
      }

      if (progress == 100) {
         if (props.onCompleted !== undefined) {
            props.onCompleted(motionVerified);
         }
      }
   };

   const renderDetectionInstruction = () => {
      if (props.renderFooter !== undefined) {
         return renderFooter(faceVerifications[motionVerified.length]);
      } else {
         if (faceVerifications[motionVerified.length] == "smile") {
            return (
               <Animatable.View animation="fadeInUp" duration={500} style={style.instruction_box}>
                  <Text style={style.instruction_box_title}>Smile</Text>
                  <Text style={style.instruction_box_desc}>
                     Please smile to the camera and make sure you face the screen straight forward
                  </Text>
               </Animatable.View>
            );
         }
         if (faceVerifications[motionVerified.length] == "blink") {
            return (
               <Animatable.View animation="fadeInUp" duration={500} style={style.instruction_box}>
                  <Text style={style.instruction_box_title}>Blink Eyes</Text>
                  <Text style={style.instruction_box_desc}>
                     Please blink both of your eyes to the camera and make sure you face the screen
                     straight forward
                  </Text>
               </Animatable.View>
            );
         }

         if (faceVerifications[motionVerified.length] == "nose") {
            return (
               <Animatable.View animation="fadeInUp" duration={500} style={style.instruction_box}>
                  <Text style={style.instruction_box_title}>Move Nose</Text>
                  <Text style={style.instruction_box_desc}>
                     Please move your nose to the left and right and make sure the red dot touches
                     the boudary
                  </Text>
               </Animatable.View>
            );
         }

         if (motionVerified.length === faceVerifications.length) {
            return (
               <Animatable.View animation="fadeInUp" duration={500} style={style.instruction_box}>
                  <Text style={style.instruction_box_title}>Well Done</Text>
                  <Text style={style.instruction_box_desc}>
                     You have successfully verified liveness detection
                  </Text>
               </Animatable.View>
            );
         }
      }
   };

   return (
      <View
         style={[
            style.camera_container,
            { backgroundColor: backgroundColor },
            props.containerStyle,
         ]}
         {...props}
      >
         {props.renderHeader !== undefined ? (
            props.renderHeader(face)
         ) : (
            <View style={{ height: 70 }}>
               {face == null ? (
                  <Animatable.Text
                     duration={400}
                     animation="fadeInUp"
                     style={[style.instruction_box_desc, { color: "red", fontSize: 17 }]}
                  >
                     No Face detected
                  </Animatable.Text>
               ) : (
                  <React.Fragment>
                     <Text
                        duration={400}
                        animation="fadeInUp"
                        style={[style.instruction_box_desc, { fontSize: 17 }]}
                     >
                        Face detected
                     </Text>
                     <Text style={[style.instruction_box_desc, { marginTop: 3, opacity: 0.3 }]}>
                        Please follow the instructions below
                     </Text>
                  </React.Fragment>
               )}
            </View>
         )}

         <AnimatedCircularProgress
            size={250}
            width={props.progressBarWidth !== undefined ? props.progressBarWidth : 8}
            fill={(motionVerified.length / faceVerifications.length) * 100}
            tintColor={
               motionVerified.length === faceVerifications.length
                  ? props.progressBarActiveColor !== undefined
                     ? props.progressBarActiveColor
                     : "#44bd32"
                  : props.progressBarInactiveColor !== undefined
                  ? props.progressBarInactiveColor
                  : "#0097e6"
            }
            backgroundColor={props.progressBarColor ? props.progressBarColor : "rgb(200,200,200)"}
            rotation={0}
            duration={600}
            onFillChange={handleOnProgressChange}
            children={() => {
               return (
                  <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }}>
                     {motionVerified.length === faceVerifications.length ? (
                        <Animatable.View
                           animation={"zoomIn"}
                           duration={400}
                           style={{
                              justifyContent: "center",
                              position: "absolute",
                              alignItems: "center",
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 99,
                           }}
                        >
                           {picture !== null &&
                           props.displayPictureOnCompleted !== undefined &&
                           props.displayPictureOnCompleted == true ? (
                              <Image
                                 resizeMode="cover"
                                 source={{
                                    uri: picture,
                                 }}
                                 style={{
                                    width: 300,
                                    height: 300,
                                    borderRadius: 300,
                                    overflow: "hidden",
                                 }}
                              />
                           ) : (
                              <MaterialIcons name="verified-user" size={60} color="#44bd32" />
                           )}
                        </Animatable.View>
                     ) : (
                        false
                     )}
                     {isCameraLoaded ? (
                        <Camera
                           zoom={0.002}
                           ref={cameraRef}
                           autoFocus={false}
                           ratio="1:1"
                           style={style.camera}
                           type={Camera.Constants.Type.front}
                           onCameraReady={handleOnCameraReady}
                           onMountError={handleErrorCamera}
                           onFacesDetected={
                              motionVerified.length === faceVerifications.length
                                 ? undefined
                                 : handleOnDetectFaces
                           }
                           faceDetectorSettings={
                              motionVerified.length === faceVerifications.length
                                 ? undefined
                                 : {
                                      mode: FaceDetector.FaceDetectorMode.fast,
                                      detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                                      runClassifications:
                                         FaceDetector.FaceDetectorClassifications.none,
                                      minDetectionInterval: 100,
                                      tracking: true,
                                   }
                           }
                           {...props}
                        >
                           {faceVerifications[motionVerified.length] == "nose" ? (
                              <React.Fragment>
                                 <Animatable.View
                                    duration={1200}
                                    animation={"flash"}
                                    iterationCount={"infinite"}
                                    style={[
                                       style.motion_nose_pointer,
                                       {
                                          left: noseBasePosition.x,
                                          top: noseBasePosition.y,
                                       },
                                    ]}
                                 />
                                 <View></View>
                              </React.Fragment>
                           ) : (
                              false
                           )}
                        </Camera>
                     ) : (
                        false
                     )}
                  </ViewShot>
               );
            }}
         ></AnimatedCircularProgress>
         {renderDetectionInstruction()}
      </View>
   );
};

const style = StyleSheet.create({
   camera_container: {
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
   },
   camera_overlay: {
      width: 250,
      height: 250,
      borderRadius: 250 / 2,
      overflow: "hidden",
   },
   camera: {
      width: 250,
      height: 250,
      borderRadius: 250 / 2,
   },
   instruction_box: {
      marginHorizontal: 35,
      padding: 20,
      height: 120,
      marginTop: 15,
   },
   instruction_box_title: {
      textAlign: "center",
      marginBottom: 5,
      fontSize: 18,
      fontFamily: "bold",
   },
   instruction_box_desc: {
      textAlign: "center",
      opacity: 0.6,
      fontSize: 14,
      lineHeight: 19,
   },
   motion_nose_pointer: {
      width: 10,
      height: 10,
      borderRadius: 10 / 2,
      marginLeft: -5,
      marginTop: -5,
      backgroundColor: "red",
      position: "absolute",
   },
   camera_text: {
      fontSize: 15,
      color: "black",
      opacity: 1,
   },
   camera_text_description: {
      marginTop: 5,
      fontSize: 13,
      color: "black",
      opacity: 0.5,
      lineHeight: 18,
      maxWidth: "60%",
      textAlign: "center",
   },
});
