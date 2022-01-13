import GlobalStore from "./store_global";

export default class Stores {
   constructor() {
      this.global = new GlobalStore(this);
   }
}
