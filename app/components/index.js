// All the imported components
import LocalNotificationAdapter from "./component_notification_adapter";
import { Register, Receiver, IsAllowed, Prompt, SendLocal } from "./component_notification";
import { Log, Fetch as FetchLogs, Error, Clear, Warning, Display } from "./component_report";
import Text from "./component_text";
import InputText from "./component_input_text";
import Button from "./component_button";
import Padding from "./component_padding";
import Center from "./component_center";
import List from "./component_list";
import Indicator from "./component_indicator";
import Camera from "./component_camera";
import CameraRoll from "./component_camera_roll";
import CameraLiveness from "./component_camera_liveness";
import CameraScanner from "./component_camera_scanner";
import ImageViewer from "./component_image_preview";
import * as Location from "./component_location";
import {
   Compress,
   Crop,
   Rotate,
   Flip,
   Format,
   ConvertToBase64,
   ImageScanner,
} from "./component_image_manipulator";
import Header from "./component_header";
import { Data, Fetch } from "./component_data";
import { Generate } from "./component_deeplink";
import * as Page from "./component_page";

// Exports shared components
export default {
   Notification: LocalNotificationAdapter,
   PushNotification: {
      IsAllowed: IsAllowed,
      Register: Register,
      Receiver: Receiver,
      Prompt: Prompt,
      SendLocal: SendLocal,
   },
   Text: Text,
   Input: InputText,
   Button: Button,
   Padding: Padding,
   Center: Center,
   List: List,
   Indicator: Indicator,
   Header: Header,
   Data: {
      Render: Data,
      Fetch: Fetch,
   },
   Camera: {
      Picture: Camera,
      Liveness: CameraLiveness,
      Roll: CameraRoll,
      Scanner: CameraScanner,
   },
   Image: {
      Preview: ImageViewer,
      ScanFromURL: ImageScanner,
      Manipulator: {
         Compress: Compress,
         Crop: Crop,
         Rotate: Rotate,
         Flip: Flip,
         Format: Format,
         ConvertToBase64: ConvertToBase64,
      },
   },
   Report: {
      Log: Log,
      Error: Error,
      Warning: Warning,
      Fetch: FetchLogs,
      Clear: Clear,
      Display: Display,
   },
   Deeplink: {
      Generate: Generate,
   },
   Location: Location,
   Page: Page,
};
