// Profile screen

import React from "react";
import { View, Text, StyleSheet, Button, Platform } from "react-native";

export default class FeedbackScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This will be the feedback screen</Text>
        <Button
          title="Go to Feed/Home"
          onPress={() => this.props.navigation.navigate("Home")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
