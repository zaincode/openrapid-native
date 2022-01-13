import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import CryptoJS from "react-native-crypto-js";
import * as Crypto from "expo-crypto";

// Gets image library permission before
const getImageLibraryPermission = async () => {
   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
   return status === "granted" ? true : false;
};

// Gets camera permission before
const getCameraPermission = async () => {
   const { status } = await Permissions.askAsync(Permissions.CAMERA);
   return status === "granted" ? true : false;
};

// Default camera configuration
// This configuration can be override by adding an object in second parameter
// of the takePicture function
const defaultCameraConfiguration = {
   mediaTypes: ImagePicker.MediaTypeOptions.Images,
   quality: 1,
};

// Default camera configuration
// This configuration can be override by adding an object in second parameter
// of the takePicture function
const defaultGalleryConfiguration = {
   quality: 1,
};

// Cryptographic signature
const CryptoJSAesJson = {
   stringify: function (cipherParams) {
      var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      if (cipherParams.iv) j.iv = cipherParams.iv.toString();
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
   },
   parse: function (jsonStr) {
      var j = JSON.parse(jsonStr);
      var cipherParams = CryptoJS.lib.CipherParams.create({
         ciphertext: CryptoJS.enc.Base64.parse(j.ct),
      });
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
      return cipherParams;
   },
};

export const Helper = {
   BASE64: "base64",
   // Creates a random UUID string
   createUUID: () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
         var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
         return v.toString(16);
      });
   },
   SHA512: async (string) => {
      const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, string);
      return digest;
   },
   encodeBase64: (data) => {
      const encodedWord = CryptoJS.enc.Utf8.parse(data); // encodedWord Array object
      const encoded = CryptoJS.enc.Base64.stringify(encodedWord); // string: 'NzUzMjI1NDE='
      return encoded;
   },
   decodeBase64: (data) => {
      const encodedWord = CryptoJS.enc.Base64.parse(data); // encodedWord via Base64.parse()
      const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify() '75322541'
      return decoded;
   },
   encrypt: (secret, data) => {
      // Chiper the data
      const encrypted_text = CryptoJS.AES.encrypt(JSON.stringify(data), secret, {
         format: CryptoJSAesJson,
      }).toString();
      return encrypted_text;
   },
   decrypt: (secret, encrypted_text) => {
      // Decrypt the message using CryptoJSAesJson format
      var decrypted_message = CryptoJS.AES.decrypt(encrypted_text, secret, {
         format: CryptoJSAesJson,
      }).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted_message);
   },
   // Open Camera and start taking picture
   openCamera: async (type = "uri", config = defaultCameraConfiguration) => {
      const isPermissionGranted = await getCameraPermission();
      // Check if camera permition is granted
      if (isPermissionGranted) {
         try {
            // If camera should returns base64 string
            if (type == "base64") {
               Object.assign(config, { base64: true });
            }
            // Begin taking picture
            let result = await ImagePicker.launchCameraAsync(config);
            // If user not cancelled taking the picture
            if (!result.cancelled) {
               return result;
            } else {
               return false;
            }
         } catch (E) {
            console.log(E);
         }
      }
   },
   // Open Camera and start taking picture
   openGallery: async (type = "uri", config = defaultGalleryConfiguration) => {
      const isPermissionGranted = await getImageLibraryPermission();
      // Check if camera permition is granted
      if (isPermissionGranted) {
         try {
            // If camera should returns base64 string
            if (type == "base64") {
               Object.assign(config, { base64: true });
            }
            // Begin taking picture
            let result = await ImagePicker.launchImageLibraryAsync(config);
            // If user not cancelled taking the picture
            if (!result.cancelled) {
               return result;
            } else {
               return false;
            }
         } catch (E) {
            console.log(E);
         }
      }
   },
   async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
         await callback(array[index], index, array);
      }
   },
   sendLog: (data) => {
      console.log(data);
      console.log("--");
   },
};
