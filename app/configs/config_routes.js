import React from "react";

// Import react navigation dependencies
// Note that its a react-navigation version 5x
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { observer, inject } from "mobx-react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LocalNotificationAdapter from "../components/component_notification_adapter";
import screens from "../screens";
// Create the react-navigation stack instances
// you can adjust all the navigation requirementshere
// For example, TabNavigator, SwithNavigator etc.
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const ScreenOptions = {
   ...TransitionPresets.SlideFromRightIOS,
};

const modalOptions = {
   headerShown: false,
};

// Router Class
@inject("stores")
@observer
export default class Routes extends React.Component {
   render() {
      return (
         <React.Fragment>
            <NavigationContainer>
               <Stack.Navigator screenOptions={{ header: () => null, ...ScreenOptions }}>
                  <React.Fragment>
                     {Object.keys(screens).map((item) => {
                        if (
                           screens[item].children !== undefined &&
                           screens[item].children !== null
                        ) {
                           const childrenScreen = () => {
                              return (
                                 <Tab.Navigator {...screens[item].config}>
                                    {Object.keys(screens[item].children).map((itemChildren) => {
                                       if (
                                          screens[item].children[itemChildren].authentication !==
                                          undefined
                                       ) {
                                          if (
                                             screens[item].children[itemChildren].authentication ==
                                                true &&
                                             this.props.stores.global.isUserAuthenticated == true
                                          ) {
                                             return (
                                                <Tab.Screen
                                                   key={itemChildren}
                                                   name={itemChildren}
                                                   {...screens[item].children[itemChildren]}
                                                   component={
                                                      screens[item].children[itemChildren].screen
                                                   }
                                                   options={
                                                      screens[item].children[itemChildren].options
                                                   }
                                                />
                                             );
                                          }
                                          if (
                                             screens[item].children[itemChildren].authentication ==
                                                false &&
                                             this.props.stores.global.isUserAuthenticated == false
                                          ) {
                                             return (
                                                <Tab.Screen
                                                   key={itemChildren}
                                                   name={itemChildren}
                                                   {...screens[item].children[itemChildren]}
                                                   component={
                                                      screens[item].children[itemChildren].screen
                                                   }
                                                   options={
                                                      screens[item].children[itemChildren].options
                                                   }
                                                />
                                             );
                                          }
                                       } else {
                                          return (
                                             <Tab.Screen
                                                key={itemChildren}
                                                name={itemChildren}
                                                {...screens[item].children[itemChildren]}
                                                component={
                                                   screens[item].children[itemChildren].screen
                                                }
                                                options={
                                                   screens[item].children[itemChildren].options
                                                }
                                             />
                                          );
                                       }
                                    })}
                                 </Tab.Navigator>
                              );
                           };
                           return (
                              <Tab.Screen
                                 key={item}
                                 name={item}
                                 component={childrenScreen}
                                 options={screens[item].options}
                              />
                           );
                        } else {
                           if (screens[item].authentication !== undefined) {
                              if (
                                 screens[item].authentication == true &&
                                 this.props.stores.global.isUserAuthenticated == true
                              ) {
                                 return (
                                    <Stack.Screen
                                       key={item}
                                       name={item}
                                       {...screens[item]}
                                       component={screens[item].screen}
                                       options={screens[item].options}
                                    />
                                 );
                              }
                              if (
                                 screens[item].authentication == false &&
                                 this.props.stores.global.isUserAuthenticated == false
                              ) {
                                 return (
                                    <Stack.Screen
                                       key={item}
                                       name={item}
                                       {...screens[item]}
                                       component={screens[item].screen}
                                       options={screens[item].options}
                                    />
                                 );
                              }
                           } else {
                              return (
                                 <Stack.Screen
                                    key={item}
                                    name={item}
                                    {...screens[item]}
                                    component={screens[item].screen}
                                    options={screens[item].options}
                                 />
                              );
                           }
                        }
                     })}
                  </React.Fragment>
               </Stack.Navigator>
            </NavigationContainer>
            <LocalNotificationAdapter />
         </React.Fragment>
      );
   }
}
