// Loads all of your screen file and configuration here
// We will generate each of em automatically
// See the documentation.md if you still dont understand

export default {
   // Example: {
   //    screen: require("./screen_example").screen,
   //    options: {
   //       title: "Qwdqwd",
   //    },
   // },
   StackedScreen: {
      config: {
         tabBarPosition: "bottom",
      },
      children: {
         StackedScreenIndex: {
            screen: require("./screen_example").screen,
         },
         StackedScreenProfile: {
            screen: require("./screen_example").screen,
         },
      },
   },
};
