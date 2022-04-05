import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Rating } from 'react-native-ratings';
import "./Account.css";
import {getUserMessages} from '../ServerFacade';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

class MessagesTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ratings: props.messagesSent
    };
  }

  render() {
    return (
      <View style={styles.messagesTabContainer}>
        User Messages Coming Soon!
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messagesTabContainer: {
    flexDirection: "column",
    padding: '2%',
  },
});

export default MessagesTab;
