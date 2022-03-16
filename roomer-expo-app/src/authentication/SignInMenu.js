import React, { Component } from 'react';
import {
    View,
    Text, 
    TextInput,
} from 'react-native';
import CognitoAuthenticationButton from './CognitoAuthenticationButton';
import OAuthAuthenticationButton from './OAuthAuthenticationButton';
import styles from './MenuStyles'
import { Auth } from 'aws-amplify'
import { getUsername, createUser } from '../ServerFacade';
import { addProfileImage } from '../AWS';

const HyperlinkText = props => {
    return (
      <Text style={props.style} onPress={props.onPress}>
        {props.text}
      </Text>
    );
  };

class SignInMenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            exitMenu: props.exitMenu
        }
    }

    async cognitoSignIn(username, password) {
      if (username === "" || password === "") {
        alert('Please enter a valid email and password');
      } else {
        try {
          const user = await Auth.signIn(username, password);
          let names = user["attributes"]["name"].split(" ");
          let response = await getUsername(user["username"])
          if (Object.keys(response).length === 0) {
            await createUser(user["username"], user["attributes"]["email"], names[0] + " " + names[1]);
            await addProfileImage(user["username"]);
          }
          let parsedUser = {
            Username: user["username"],
            FirstName: names[0],
            LastName: names[1],
            Email: user["attributes"]["email"]
          }
          this.state.exitMenu(parsedUser);
        } catch (error) {
        }
      }
    }

    render() {
      return (
        <View style={styles.menuStyle}>
          <Text style={styles.categoryTextStyle}>
            Email
          </Text>
          <TextInput
            placeholder='Enter Email'
            style={styles.textInputStyle}
            onChangeText={(newValue)=>this.setState({email: newValue})}/>
          <Text style={styles.categoryTextStyle}>
            Password
          </Text>
          <TextInput
            placeholder='Enter Password'
            style={styles.textInputStyle}
            secureTextEntry={true}
            onChangeText={(newValue)=>this.setState({password: newValue})}/>
          <CognitoAuthenticationButton
            text="Sign In"
            buttonStyle={styles.cognitoButtonStyle}
            textStyle={styles.cognitoButtonTextStyle}
            onPress={() => {
              this.cognitoSignIn(this.state.email, this.state.password)
            }}
          />
          <HyperlinkText
            text="Forgot Password?"
            style={styles.hyperLinkStyle}
            onPress={() => console.log('TODO: IMPLMENT FORGOT PASSWORD')}
          />  
          <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: .5,
            width: 150,
            alignSelf: 'center',
            marginBottom: 10,
          }}/>
          <Text style={[styles.categoryTextStyle, styles.registerHintTextStyle]}>
            Or sign in with:
          </Text>
          <OAuthAuthenticationButton
            text="Google"
            isGoogle={true}
            buttonStyle={styles.googleButtonStyle}
            textStyle={styles.googleButtonTextStyle}
            onPress={() => console.log(this.state.firstName + " " + this.state.lastName + " " + this.state.email + " " + this.state.password + " " + this.state.confPassword)}
          />
          <OAuthAuthenticationButton
            text="Facebook"
            isGoogle={false}
            buttonStyle={styles.facebookButtonStyle}
            textStyle={styles.facebookButtonTextStyle}
            onPress={() => console.log(this.state.firstName + " " + this.state.lastName + " " + this.state.email + " " + this.state.password + " " + this.state.confPassword)}
          />
        </View> 
      )
    }
}

export default SignInMenu
