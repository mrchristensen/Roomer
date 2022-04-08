import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import RegisterMenu from "./RegisterMenu.js";
import SignInMenu from "./SignInMenu.js";
import ConfirmSignUp from "./ConfirmSignUp.js";
import { Icon } from "react-native-elements";

class AuthenticationCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOption: "SignIn",
      exitMenu: props.exitMenu,
      exitNoLogin: props.exitNoLogin,
    };
  }

  render() {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.iconflex}>
          <View style={styles.menuFlex}>
            <TouchableOpacity
              onPress={(event) => {
                if (this.state.menuOption !== "SignIn") {
                  this.setState({
                    menuOption: "SignIn",
                  });
                }
              }}
            >
              <Text
                style={[
                  this.state.menuOption === "SignIn" && styles.selectedText,
                  styles.textStyle,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(event) => {
                if (this.state.menuOption !== "Register") {
                  this.setState({
                    menuOption: "Register",
                  });
                }
              }}
            >
              <Text
                style={[
                  this.state.menuOption === "Register" && styles.selectedText,
                  styles.textStyle,
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(event) => {
                if (this.state.menuOption !== "Confirm") {
                  this.setState({
                    menuOption: "Confirm",
                  });
                }
              }}
            >
              <Text
                style={[
                  this.state.menuOption === "Confirm" && styles.selectedText,
                  styles.textStyle,
                ]}
              >
                Confirm Email
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={this.state.exitNoLogin}
            style={styles.touchableIconContainer}
          >
            <Icon name="close" type="antdesign" color={"#1f241a"} />
          </TouchableOpacity>
        </View>
        {this.state.menuOption === "SignIn" && (
          <SignInMenu exitMenu={this.state.exitMenu} />
        )}
        {this.state.menuOption === "Register" && (
          <RegisterMenu
            changeMenu={(option) => this.setState({ menuOption: option })}
          />
        )}
        {this.state.menuOption === "Confirm" && (
          <ConfirmSignUp
            changeMenu={(option) => this.setState({ menuOption: option })}
          />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menuFlex: {
    flexDirection: "row",
    borderBottomColor: "black",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    width: 220,
    alignSelf: "center",
    marginBottom: 10,
    marginRight: "auto",
  },
  iconflex: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "300",
  },
  selectedText: {
    borderBottomColor: "#397292",
    borderBottomWidth: 3.5,
  },
});

export default AuthenticationCard;
