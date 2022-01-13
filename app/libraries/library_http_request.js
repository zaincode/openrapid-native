import Session from "./library_session_storage";
const axios = require("axios");

export const HttpRequest = {
   result: null,
   useAuthentication: false,
   post: async function (path, data = {}, extraHeader = {}) {
      const token = await Session.get("@user/auth:token");
      const requestConfiguration = {
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Accept-Auth-Token": token,
         },
      };
      Object.assign(requestConfiguration.headers, extraHeader);
      try {
         const request = await axios.post(path, data, requestConfiguration);
         console.log("-- Endpoint : " + path);
         // console.log("-- Params : ", request.data);
         if (request.status === 200) {
            this.result = request.data !== undefined ? request.data : null;
            return await this.result;
         } else {
            return false;
         }
      } catch (e) {
         console.log(e);
         return false;
      }
   },
   get: async function (path, extraHeader = {}) {
      const token = await Session.get("@user/auth:token");
      const config = {
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Accept-Auth-Token": token,
         },
      };
      Object.assign(config.headers, extraHeader);
      try {
         const request = await axios.get(path, config);
         console.log("-- Endpoint : " + path);
         // console.log("-- Params : ", request.data);
         if (request.status === 200) {
            this.result = request.data !== undefined ? request.data : null;
            return await this.result;
         } else {
            return false;
         }
      } catch (e) {
         return false;
      }
   },
   async post_multipart(path, data = {}, extraHeader = {}) {
      const token = await Session.get("@user/auth:token");
      const config = {
         headers: {
            "Content-Type": "multipart/form-data",
            "Accept-Auth-Token": token,
         },
      };
      Object.assign(config.headers, extraHeader);
      try {
         const request = await axios.post(path, data, config);
         console.log("-- Endpoint : " + path);
         // console.log("-- Params : ", request.data);
         if (request.status === 200) {
            this.result = request.data !== undefined ? request.data : null;
            return await this.result;
         } else {
            console.log("Something went wrong, receive status " + request.status + " from " + path);
            return false;
         }
      } catch (e) {
         console.log(e);
         return false;
      }
   },
};
