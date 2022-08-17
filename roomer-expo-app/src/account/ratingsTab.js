import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Rating } from "react-native-ratings";
import "./Account.css";

const win = Dimensions.get("window");
const isMobile = win.width < 600;

class RatingsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ratings: props.ratings,
    };
  }

  render() {
    return (
      <View style={styles.ratingsTabContainer}>User Ratings Coming Soon!</View>
    );
  }
}

const styles = StyleSheet.create({
  ratingsTabContainer: {
    flexDirection: "column",
    padding: "2%",
  },
});

export default RatingsTab;
