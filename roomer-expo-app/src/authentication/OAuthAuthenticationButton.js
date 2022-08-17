import React from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const OAuthAuthenticationButton = (props) => {
  const logo = props.isGoogle
    ? "https://img.icons8.com/color/48/000000/google-logo.png"
    : "https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png";
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, props.buttonStyle]}
      onPress={props.onPress}
    >
      <View style={styles.flexStyle}>
        <Image
          source={{
            uri: logo,
          }}
          style={[styles.cancelIcon]}
        />
        <Text style={props.textStyle}>{props.text}</Text>
        <View style={styles.cancelIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 25,
    marginBottom: 20,
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 0.5,
    borderStyle: "solid",
    borderRadius: 5,
  },
  flexStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelIcon: {
    height: 15,
    width: 15,
  },
});

export default OAuthAuthenticationButton;
