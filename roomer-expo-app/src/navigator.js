import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, NavigationEvents } from "react-navigation";
import { createBrowserApp } from "@react-navigation/web";
import { Platform } from "react-native";

import ProfileScreen from "./screens/profileScreen";
import Account from "./account/account";
import HomeScreen from "./screens/homeScreen";
import FeedbackScreen from "./screens/feedbackScreen";

const isWeb = Platform.OS === "web";

const Navigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      path: "home",
      navigationOptions: {
        header: null,
      },
    },
    Profile: {
      screen: Account,
      path: "profile",
      // https://stackoverflow.com/questions/43729944/how-to-set-headermode-on-some-routes-but-not-others-react-navigation
      navigationOptions: {
        header: null,
      },
    },
    Feedback: {
      screen: FeedbackScreen,
      path: "feedback",
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    // navigationOptions: {
    //   headerMode: null,
    //   headerTintColor: "#ffffff",
    //   headerStyle: {
    //     backgroundColor: "#ffffff",
    //   },
    // },
    defaultNavigationOptions: () => ({
      cardStyle: {
          backgroundColor: "#fff",
      },
  }),
  }
);

const container = isWeb
  ? createBrowserApp(Navigator)
  : createAppContainer(Navigator);

export default container;
