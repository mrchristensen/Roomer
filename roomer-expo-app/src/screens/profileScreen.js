// Profile screen

import React from "react";
import { View, Text, StyleSheet, Button, Platform } from "react-native";

export default class ProfileScreen extends React.Component {
  static path = "";

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the profile screen</Text>
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
