import React, { Component } from 'react';
import {
    View,
    Text, 
    TextInput,
    ActivityIndicator
} from 'react-native';
import CognitoAuthenticationButton from './CognitoAuthenticationButton';
import OAuthAuthenticationButton from './OAuthAuthenticationButton';
import styles from './MenuStyles'
import {Auth} from 'aws-amplify'
import { ScrollView } from 'react-native-gesture-handler';

class RegisterMenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confPassword: "",
            enableSignUpButton: false,
            passwordChecker: new RegExp(
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
            ),
            changeDisplayMenu: props.changeMenu,
            showProgressIndicator: false,
        }
    }

    async cognitoSignUp() {
        this.setState({showProgressIndicator: true});
        if (!this.state.passwordChecker.test(this.state.password)) {
          alert(
            'Please put in a valid Email, First name, Last name, and Password.\nA Valid password consists of eight characters with at least one Capital, Lower case, and Special Character.',
          );
        } else {
          try {
            let username = this.state.email
            let email = this.state.email
            let password = this.state.password
            let name = this.state.firstName + " " + this.state.lastName
            const {user} = await Auth.signUp({
              username,
              password,
              attributes: {
                email,
                name
              },
            }); 

            this.state.changeDisplayMenu('Confirm')
          } catch (error) {
            console.log(error)
            alert('An error occured in the singup proccess. Please verify that you are using a unique email and a valid password.')
          }
        }
        this.setState({showProgressIndicator: false});
    }

    render() {
        return (
            <View style={styles.menuStyle}>
                <ScrollView>
                <Text style={styles.categoryTextStyle}>
                    First Name
                </Text>
                <TextInput
                    placeholder='First Name'
                    style={styles.textInputStyle}
                    onChangeText={(newValue)=>
                        this.setState({firstName: newValue})
                    }/>
                <Text style={styles.categoryTextStyle}>
                    Last Name
                </Text>
                <TextInput
                    placeholder='Last Name'
                    style={styles.textInputStyle}
                    onChangeText={(newValue)=>this.setState({lastName: newValue})}/>
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
                    onChangeText={(newValue) =>this.setState({password: newValue})}/>
                <Text style={styles.categoryTextStyle}>
                    Confirm Password
                </Text>
                <TextInput
                    placeholder='Enter Password'
                    style={styles.textInputStyle}
                    secureTextEntry={true}
                    onChangeText={(newValue)=>this.setState({confPassword: newValue})}/>
                <CognitoAuthenticationButton
                    text="Register"
                    buttonStyle={styles.cognitoButtonStyle}
                    textStyle={styles.cognitoButtonTextStyle}
                    onPress={()=>this.cognitoSignUp()}
                />
                <ActivityIndicator size="large" animating={this.state.showProgressIndicator}/>
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: .5,
                    width: 150,
                    alignSelf: 'center',
                    marginBottom: 10,
                    marginTop: 10,
                }}/>
                <Text style={[styles.categoryTextStyle, styles.registerHintTextStyle]}>
                    Or register with:
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
                </ScrollView>
            </View>
        )
    }
}



export default RegisterMenu;