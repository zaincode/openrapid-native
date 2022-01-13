import React from "react";
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native";
import { HttpRequest } from "../libraries/library_http_request";

export const Fetch = {
   headers: {},
   Post: async (url, data = {}, callback = () => {}) => {
      if (url !== undefined) {
         const fetchData = await HttpRequest.post(url, data, Fetch.headers);
         if (fetchData !== false) {
            return callback(fetchData);
         } else {
            // Failed fetching data
         }
      } else {
      }
   },
   Get: async (url, callback = () => {}) => {
      if (url !== undefined) {
         const fetchData = await HttpRequest.get(url, Fetch.headers);
         if (fetchData !== false) {
            return callback(fetchData);
         } else {
            // Failed fetching data
         }
      } else {
      }
   },
   PostAsync: async (url, data = {}, headers = {}) => {
      if (url !== undefined) {
         const fetchData = await HttpRequest.post(url, data, headers);
         if (fetchData !== false) {
            return fetchData;
         } else {
            // Failed fetching data
         }
      } else {
      }
   },
   GetAsync: async (url, headers = {}) => {
      if (url !== undefined) {
         const fetchData = await HttpRequest.get(url, headers);
         if (fetchData !== false) {
            return fetchData;
         } else {
            // Failed fetching data
         }
      } else {
      }
   },
};

export const Data = React.memo((props) => {
   const [dataSource, setDataSource] = React.useState([]);
   const [isRefreshingDataSource, setLoadingRefreshingDataSource] = React.useState(false);
   const [isLoadingdataSource, setLoadingDataSource] = React.useState(true);
   const [dataSourcePage, setDataSourcePage] = React.useState(1);

   React.useEffect(async () => {
      var parameters = "?";

      // check if parameter lazyload is exist
      if (props.lazyLoad !== undefined) {
         parameters += new URLSearchParams({
            ...props.source.params,
            page: dataSourcePage,
            size: props.lazyLoadSize !== undefined ? props.lazyLoadSize : 10,
         }).toString();
      }

      if (props.source.url !== undefined) {
         const data = await Fetch.GetAsync(props.source.url + parameters, props.source.headers);
         if (props.source.data !== undefined) {
            setDataSource(data[props.source.data]);
            if (props.onLoad !== undefined) {
               // Do some filtering first here
               return props.onLoad(data[props.source.data]);
            }
            setLoadingDataSource(false);
         } else {
            setDataSource(data);
            if (props.onLoad !== undefined) {
               // Do some filtering first here
               return props.onLoad(data);
            }
            setLoadingDataSource(false);
         }
      } else {
         setLoadingDataSource(false);
      }
   }, [props.source]);

   const handleRefresh = () => {
      setLoadingRefreshingDataSource(true);
      setLoadingRefreshingDataSource(false);
   };

   const onScrollEnds = async () => {
      if (props.lazyLoad !== undefined) {
         var nextPage = dataSourcePage + 1;
         var parameters =
            "?" +
            new URLSearchParams({
               ...props.source.params,
               page: nextPage,
               size: props.lazyLoadSize !== undefined ? props.lazyLoadSize : 10,
            }).toString();
         setDataSourcePage(nextPage);
         const data = await Fetch.GetAsync(props.source.url + parameters, props.source.headers);
         if (props.source.data !== undefined) {
            if (data[props.source.data].length > 0) {
               var newData = [...dataSource, ...data[props.source.data]];
               setDataSource(newData);
               if (props.onLoad !== undefined) {
                  // Do some filtering first here
                  return props.onLoad(newData);
               }
               setLoadingDataSource(false);
            } else {
               setLoadingDataSource(false);
            }
         } else {
            var newData = [...dataSource, ...data];
            if (data.length > 0) {
               setDataSource(newData);
               if (props.onLoad !== undefined) {
                  // Do some filtering first here
                  return props.onLoad(newData);
               }
               setLoadingDataSource(false);
            } else {
               setLoadingDataSource(false);
            }
         }
      } else {
         var nextPage = props.source.page !== undefined ? props.source.page + 1 : 0;
         props.onScrollEnd(nextPage);
      }
   };

   return (
      <FlatList
         onRefresh={handleRefresh}
         refreshing={isRefreshingDataSource}
         style={[style.data, props.style]}
         data={dataSource}
         renderItem={props.template}
         keyExtractor={(item, index) =>
            item.key !== undefined ? item.key.toString() : index.toString()
         }
         ListHeaderComponent={
            props.templateHeader !== undefined ? (
               props.templateHeader
            ) : isLoadingdataSource ? (
               props.renderLoader !== undefined ? (
                  props.renderLoader
               ) : (
                  <View
                     style={{
                        flex: 1,
                        marginVertical: 10,
                     }}
                  >
                     <ActivityIndicator size="small" />
                  </View>
               )
            ) : undefined
         }
         ListFooterComponent={() =>
            isLoadingdataSource ? (
               props.renderLoader !== undefined ? (
                  props.renderLoader
               ) : (
                  <View
                     style={{
                        flex: 1,
                        marginVertical: 10,
                     }}
                  >
                     <ActivityIndicator size="small" />
                  </View>
               )
            ) : null
         }
         maxToRenderPerBatch={props.lazyLoadSize !== undefined ? props.lazyLoadSize : 10}
         initialNumToRender={props.lazyLoadSize !== undefined ? props.lazyLoadSize : 10}
         onEndReached={onScrollEnds}
         onEndReachedThreshold={0.3}
         {...props}
      />
   );
});

const style = StyleSheet.create({
   data: {
      flex: 1,
   },
});
