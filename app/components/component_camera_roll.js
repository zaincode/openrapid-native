// Main Imports
import React from "react";
import {
   StyleSheet,
   Text,
   Dimensions,
   Image,
   View,
   FlatList,
   TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default class Camera extends React.PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         cameraAssets: [],
         assetsLoadMore: true,
         assetLastFetchedId: null,
         assetLoadedContent: 10,
         isRefreshing: false,
         isAccessGranted: false,
      };
   }

   async componentDidMount() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      this.setState({
         isAccessGranted: status === "granted",
      });
      if (status === "granted") {
         await this.handleOnEndReached();
      }
   }

   // Handle on selecting asset
   handleOnSelectAssetItems = async (item, index) => {
      if (this.props.onSelect !== undefined) {
         const info = await MediaLibrary.getAssetInfoAsync(item.id);
         this.props.onSelect(info, index);
      }
   };

   // Handle load media files
   handleOnEndReached = async () => {
      if (this.state.assetsLoadMore == true) {
         const nextLoadedAsset = this.state.assetLoadedContent + this.state.assetLoadedContent;
         const fetchAlbumAssets = await MediaLibrary.getAssetsAsync({
            after: this.state.assetLastFetchedId,
            first: nextLoadedAsset,
            mediaType:
               this.props.type == "image"
                  ? [MediaLibrary.MediaType.photo]
                  : this.props.type == "video"
                  ? [MediaLibrary.MediaType.video]
                  : [MediaLibrary.MediaType.video, MediaLibrary.MediaType.photo],
            sortBy: MediaLibrary.SortBy.creationTime,
         });
         this.setState({
            cameraAssets: fetchAlbumAssets.assets,
            assetsLoadMore: fetchAlbumAssets.hasNextPage,
            assetLastFetchedId: fetchAlbumAssets.assetLastFetchedId,
            assetLoadedContent: nextLoadedAsset,
         });
      }
   };

   // Handle refresh camera roll
   handleOnRefresh = async () => {
      this.setState({ isRefreshing: true });
      const nextLoadedAsset = this.state.assetLoadedContent;
      const fetchAlbumAssets = await MediaLibrary.getAssetsAsync({
         after: this.state.assetLastFetchedId,
         first: nextLoadedAsset,
         mediaType:
            this.props.type == "image"
               ? [MediaLibrary.MediaType.photo]
               : this.props.type == "video"
               ? [MediaLibrary.MediaType.video]
               : [MediaLibrary.MediaType.video, MediaLibrary.MediaType.photo],
         sortBy: MediaLibrary.SortBy.creationTime,
      });
      this.setState({
         isRefreshing: false,
         cameraAssets: fetchAlbumAssets.assets,
         assetsLoadMore: fetchAlbumAssets.hasNextPage,
         assetLastFetchedId: null,
         assetLoadedContent: nextLoadedAsset,
      });
   };

   format = (time) => {
      // Hours, minutes and seconds
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";
      if (hrs > 0) {
         ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }
      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
   };

   // Render asset items
   renderAsssetItem = ({ item, index }) => {
      const duration = this.format(parseInt(item.duration));
      return (
         <TouchableOpacity onPress={() => this.handleOnSelectAssetItems(item, index)}>
            {item.mediaType == "video" ? (
               <View style={style.camera_roll_video_time}>
                  <Text style={style.camera_roll_video_time_text}>{duration}</Text>
               </View>
            ) : (
               false
            )}
            <Image
               source={{
                  uri: item.uri,
               }}
               style={{
                  backgroundColor: "#000000",
                  width: Dimensions.get("window").width / 3,
                  height: 200,
                  borderWidth: 1.5,
               }}
               resizeMode={"cover"}
            />
         </TouchableOpacity>
      );
   };

   render() {
      return (
         <View
            style={[
               style.main_layout,
               this.props.isVisible == false ? { display: "none" } : { flex: 1, display: "flex" },
            ]}
         >
            <FlatList
               shouldItemUpdate={(props, nextProps) => {
                  return false;
               }}
               numColumns={3}
               initialNumToRender={6}
               maxToRenderPerBatch={12}
               windowSize={15}
               showsVerticalScrollIndicator={false}
               onEndReachedThreshold={0.5}
               data={this.state.cameraAssets}
               extraData={this.state.cameraAssets}
               keyExtractor={(item, index) => index.toString()}
               renderItem={this.renderAsssetItem}
               onEndReached={this.handleOnEndReached}
               onRefresh={this.handleOnRefresh}
               refreshing={this.state.isRefreshing}
            />
         </View>
      );
   }
}

const style = StyleSheet.create({
   main_layout: {
      backgroundColor: "black",
   },
   camera_header: {
      padding: 20,
   },
   camera_footer: {
      position: "absolute",
      bottom: Platform.OS == "ios" ? 40 : 30,
      left: 0,
      right: 0,
      height: 100,
      paddingHorizontal: 30,
      justifyContent: "center",
      zIndex: 2,
      elevation: 2,
   },
   camera_timer: {
      fontSize: 13,
      fontFamily: "bold",
      color: "rgb(255,255,255)",
   },
   camera_detail: {
      width: 70,
   },
   camera_timer_label: {
      fontSize: 13,
      marginTop: 0,
      color: "rgb(255,255,255)",
      opacity: 0.9,
   },
   camera_shutter: {
      marginRight: 20,
      width: 70,
      height: 70,
      borderRadius: 70 / 2,
      borderWidth: 7,
      borderColor: "rgb(255,255,255)",
   },
   camera_zoom_slider_container: {
      position: "absolute",
      right: -40,
      transform: [{ rotate: "90deg" }],
      top: Dimensions.get("window").height / 2 - 50,
   },
   camera_zoom_slider: {
      height: 50,
      width: 150,
   },
   camera_zoom_slider_label: {
      fontSize: 13,
      color: "rgb(255,255,255)",
      transform: [{ rotate: "-180deg" }],
      opacity: 0.7,
      textAlign: "right",
      position: "absolute",
   },
   media_display_backdrop: {
      height: "100%",
      width: "100%",
      elevation: 1,
      zIndex: 1,
      position: "absolute",
   },
   camera_roll_video_time: {
      position: "absolute",
      backgroundColor: "rgba(250,60,60, 1)",
      height: 20,
      paddingHorizontal: 5,
      borderRadius: 5,
      zIndex: 1,
      elevation: 3,
      right: 0,
      margin: 5,
      justifyContent: "center",
      alignItems: "center",
   },
   camera_roll_video_time_text: {
      color: "white",
      fontFamily: "bold",
      fontSize: 12,
   },
});
