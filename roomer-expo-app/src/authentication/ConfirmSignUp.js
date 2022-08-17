import React, { Component } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import CognitoAuthenticationButton from "./CognitoAuthenticationButton";
import styles from "./MenuStyles";
import { Auth } from "aws-amplify";

class ConfirmSignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      code: "",
      changeDisplayMenu: props.changeMenu,
      showProgressIndicator: false,
    };
  }

  async confirmSignUp(username, code) {
    this.setState({ showProgressIndicator: true });
    try {
      let response = await Auth.confirmSignUp(username, code);
      if (response === "SUCCESS") {
        this.state.changeDisplayMenu("SignIn");
      }
    } catch (error) {
      alert(
        "Unable to confirm Sign Up. Please make sure you've entered a valid email address and the correct confirmation code."
      );
    }
    this.setState({ showProgressIndicator: false });
  }

  render() {
    return (
      <View style={styles.menuStyle}>
        <Text
          style={[
            styles.categoryTextStyle,
            styles.registerHintTextStyle,
            { justifyContent: "center" },
          ]}
        >
          We've sent an email to you with a confirmation code. Please enter it
          and your email below. You will need to login after confirming your
          email.
        </Text>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 0.5,
            width: 150,
            alignSelf: "center",
            marginBottom: 10,
          }}
        />
        <Text style={styles.categoryTextStyle}>Email</Text>
        <TextInput
          placeholder="Enter Email"
          style={styles.textInputStyle}
          onChangeText={(newValue) => this.setState({ email: newValue })}
        />
        <Text style={styles.categoryTextStyle}>Confirmation Code</Text>
        <TextInput
          placeholder="Enter Confirmation Code"
          style={styles.textInputStyle}
          onChangeText={(newValue) => this.setState({ code: newValue })}
        />
        <ActivityIndicator
          size="large"
          animating={this.state.showProgressIndicator}
        />
        <CognitoAuthenticationButton
          text="Confirm"
          buttonStyle={styles.cognitoButtonStyle}
          textStyle={styles.cognitoButtonTextStyle}
          onPress={() => this.confirmSignUp(this.state.email, this.state.code)}
        />
      </View>
    );
  }
}

export default ConfirmSignUp;
