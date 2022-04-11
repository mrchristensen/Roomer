import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import Message from "./message";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Rating } from "react-native-ratings";
import "./Account.css";
import { getUserMessages } from "../ServerFacade";

const win = Dimensions.get("window");
const isMobile = win.width < 600;

class MessagesTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false, //sets to true if api call fails
      pageSize: 10,
      lastMessageId: null,
      lastMessageDate: null,
      isEnd: false, //if end of user's posts list is reached
      userId: props.userId,
      messages: [],
      scrolling: false,
      token: props.token,
      // showUnresolved: props.showUnresolved,
    };

    getUserMessages(
      this.state.userId,
      this.state.pageSize,
      undefined,
      undefined,
      props.token
    ).then((response) => {
      console.log("response from getUserMessage: ");
      console.log(response);
      console.log("response.Items[0].POST_ID");
      console.log(response.Items[0].POST_ID);
      if (response != -1) {
        this.setState((prevState) => ({
          ...prevState,
          lastMessageId:
            response.Items.length > 0
              ? response.Items[response.Items.length - 1].POST_ID
              : null,
          lastMessageDate:
            response.Items.length > 0
              ? response.Items[response.Items.length - 1].POST_DATE
              : null,
          messages: response.Items,
          isEnd: response.Items.length === 0,
          error: false,
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          error: true,
        }));
      }
    });
  }

  onEndReached = () => {
    if (this.state.isEnd) {
      return;
    }

    getUserMessages(
      this.state.userId,
      this.state.pageSize,
      this.state.lastMessageId,
      this.state.lastMessageDate,
      this.state.token
    ).then((response) => {
      console.log("response of second getUserMessages() call");
      console.log(response);
      console.log("this.state.lastMessageId");
      console.log(this.state.lastMessageId);
      console.log("this.state.lastMessageDate");
      console.log(this.state.lastMessageDate);
      if (response != -1) {
        let newPage = this.state.messages.concat(response.Items);

        this.setState({
          pageSize: this.state.pageSize,
          lastMessageId:
            response.Items.length > 0
              ? response.Items[response.Items.length - 1].POST_ID
              : null,
          lastMessageDate:
            response.Items.length > 0
              ? response.Items[response.Items.length - 1].POST_DATE
              : null,
          messages: newPage,
          isEnd: response.Items.length === 0,
          error: false,
        });
      } else {
        this.setState((prevState) => ({
          ...prevState,
          error: true,
        }));
      }
    });
  };

  render() {
    return (
      <FlatList
        style={[styles.postsContainer]}
        data={this.state.messages}
        renderItem={({ item }) => <Message props={item} />}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.5}
      />
    );
  }
}

const styles = StyleSheet.create({
  postsContainer: {
    // margin: '2%',
    height: win.height,
  },
});

export default MessagesTab;
