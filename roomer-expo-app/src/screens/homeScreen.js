/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { Component } from "react";
import { registerRootComponent } from "expo";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import Feed from "../feed/feed";
import Header from "../header/header";
import Filter from "../filter/filter";
import { responsiveWidth } from "react-native-responsive-dimensions";

const win = Dimensions.get("window");
let isMobile = win.width < 600;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedProps: {
        pageSize: 10,
        page: null,
        housingType: null,
        location: null,
        housingPrice: null,
        moveInDate: null,
        tags: null,
        roomType: null,
        layout: null,
        fromFilter: false
      },
      isDarkMode: false, //useColorScheme() === 'dark',
      loggedIn: true,
      updateFeedState: null
    };
  }

  filterValuesSet = (filterValues) => {
    
    let moveInDate = null;
    if (filterValues.moveInDate != null) {
      moveInDate = new Date(filterValues.moveInDate.year, filterValues.moveInDate.month - 1, filterValues.moveInDate.day);
      console.log(moveInDate);
      moveInDate.setHours(0, 0, 0)
    }
    console.log(filterValues.tags)
    this.setState({
      feedProps: {
        pageSize: 10,
        housingType: filterValues.homeType,
        location: filterValues.location,
        housingPrice: ((filterValues.price == 100) ? null:  filterValues.price),
        moveInDate: moveInDate,
        tags: filterValues.tags,
        roomType: filterValues.roomType,
        layout: filterValues.layout,
        fromFilter: true
      }
    });
  };

  setUpdateFeedState = (func) => {
    this.setState({
      updateFeedState: func
    });
  }

  componentDidUpdate() {
    this.state.updateFeedState(this.state.feedProps);
  }

  render() {
    if (!isMobile) {
      return (
        <SafeAreaView>
          <StatusBar
            barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          />
          <View style={[styles.sectionContainer]}>
            <Header />
            <View style={[styles.bodyContainer]}>
              <Filter 
                filterValuesSet={this.filterValuesSet} 
                updateFeedState={this.state.updateFeedState}
              />
              <Feed 
                props={this.state.feedProps} 
                setUpdateFeedState={this.setUpdateFeedState}
              />
            </View>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView>
          <StatusBar
            barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          />
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={[styles.sectionContainer]}>
              <Header />
              <View style={[styles.bodyContainer]}>
                <Feed 
                  props={this.state.feedProps} 
                  setUpdateFeedState={this.setUpdateFeedState}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({
  sectionContainer: !isMobile
    ? {
        flexDirection: "column",
        width: "100%",
        minWidth: 1024,
        overflow: "hidden",
        fontFamily: 'sans-serif'
      }
    : {
        marginTop: 0,
        paddingHorizontal: 0,
        flex: 1,
        flexDirection: "column",
        width: win.width,
        fontFamily: 'sans-serif'
      },
  bodyContainer: !isMobile
    ? {
        height: "100%",
        width: "100%",
        flex: 1,
        flexDirection: "row",
      }
    : {
        marginTop: 5,
        flexDirection: "column",
      },
  extraBoxContainer: !isMobile
    ? {
        width: "25%",
        borderRadius: 60,
        border: "2px solid #000",
      }
    : {
        width: 0,
        height: 0,
      },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 75,
    zIndex: 1,
  },
  roomerLogoContainer: {
    justifyContent: "flex-start",
  },
  roomerLogo: {
    width: 130,
    height: 75,
    left: -11,
    resizeMode: "cover",
  },
  menuContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 150,
    marginTop: 20,
  },
  userImageContainer: {
    justifyContent: "center",
  },
  userImage: {
    height: 45,
    width: 45,
    right: 20,
  },
  hamburgerMenuContainer: {
    justifyContent: "flex-end",
  },
  hamburgerMenuIcon: {
    width: 40,
    height: 40,
    top: 15,
  },
  mainContainer: {
    width: responsiveWidth(92),
  },
});

registerRootComponent(App);
export default App;
