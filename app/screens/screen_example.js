import React from "react";
import { Text } from "react-native";
import { observer, inject } from "mobx-react";
import Shared from "../components";

// Router Class
@inject("stores")
@observer
export class screen extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isLoading: false,
      };
   }

   async componentDidMount() {}

   render() {
      return (
         <Shared.Page.Await isLoading={this.state.isLoading} loader={<Text>Loading..</Text>}>
            <Shared.Camera.Liveness />
         </Shared.Page.Await>
      );
   }
}
