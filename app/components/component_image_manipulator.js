import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { BarCodeScanner } from "expo-barcode-scanner";

// Fetch device logs
export const Compress = async (uri, value = 0.5) => {
   const manipResult = await manipulateAsync(uri, [], {
      compress: value,
   });
   return manipResult;
};

// Crop the selected image
export const Crop = async (uri, options = {}) => {
   const manipResult = await manipulateAsync(
      uri,
      [
         {
            crop: options,
         },
      ],
      {}
   );
   return manipResult;
};

// Rotate the image in some degrees
export const Rotate = async (uri, value = 0) => {
   const manipResult = await manipulateAsync(
      uri,
      [
         {
            rotate: value,
         },
      ],
      {}
   );
   return manipResult;
};

// Flip the image based on vertical or horizontal
export const Flip = async (uri, value = "vertical") => {
   const manipResult = await manipulateAsync(
      uri,
      [
         {
            flip: FlipType[value == "vertical" ? "Vertical" : "Horizontal"],
         },
      ],
      {}
   );
   return manipResult;
};

// Format image into a specified extension
export const Format = async (uri, value = undefined) => {
   const manipResult = await manipulateAsync(uri, [], {
      format: SaveFormat[value],
   });
   return manipResult;
};

// Convert image into a base64 string
export const ConvertToBase64 = async (uri) => {
   const manipResult = await manipulateAsync(uri, [], {
      base64: true,
   });
   return manipResult.base64;
};

// Scan QR from URL
export const ImageScanner = async (url) => {
   await BarCodeScanner.requestPermissionsAsync();
   const scan = await BarCodeScanner.scanFromURLAsync(url);
   return scan;
};
