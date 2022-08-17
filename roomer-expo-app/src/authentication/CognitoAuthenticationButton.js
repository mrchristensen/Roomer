import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const CognitoAuthenticationButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, props.buttonStyle]}
      onPress={props.onPress}
    >
      <Text style={props.textStyle}>{props.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 25,
    marginBottom: 20,
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
  },
});

export default CognitoAuthenticationButton;
