import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Rating } from "react-native-ratings";
import { useFilePicker } from "use-file-picker";
import { Overlay, Icon } from "react-native-elements";
import { updateProfileImage } from "../AWS";
import "./Account.css";
import MessagesTab from "./messagesTab";
import PostsTab from "./postsTab";
import RatingsTab from "./ratingsTab";
import {
  getUserAccountBio,
  editUserAccountBio,
  getUsername,
} from "../ServerFacade";
import { Auth } from "aws-amplify";
import Header from "../header/header";

const win = Dimensions.get("window");
const isMobile = win.width < 600;

function EditImageComponent(props) {
  const [openFileSelector, { filesContent, loading, errors, plainFiles }] =
    useFilePicker({
      multiple: false,
      readAs: "DataURL",
      accept: [".png", ".jpg", ".jpeg", ".heic"],
    });

  React.useEffect(() => {
    if (!loading && filesContent.length != 0 && errors.length == 0) {
      updateProfileImage(props.userId, filesContent[0].content);
    }
  }, [loading]);

  return (
    <Text style={[styles.uploadPictureText]} onPress={openFileSelector}>
      Change profile picture
    </Text>
  );
}

class EditProfileOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: props.props.profile,
      onPress: props.props.onPressEdit,
      onEdit: props.props.onEdit,
      userId: props.props.userId,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  onChangeText(event) {
    this.setState((prevState) => ({
      ...prevState,
      profile: event.target.value,
    }));
  }

  async handleOnSubmit(event) {
    event.preventDefault();

    if (this.state.profile) {
      let error = await editUserAccountBio(
        this.state.userId,
        this.state.profile,
        this.state.token
      );
      if (error == -1) {
        this.setState((prevState) => ({
          ...prevState,
          error: true,
        }));
      }

      //update ui
      this.state.onEdit(this.state.profile);

      //close edit overlay
      this.state.onPress();
    }
  }

  render() {
    return (
      <View style={styles.editOverlayContainer}>
        <TouchableOpacity
          onPress={this.state.onPress}
          style={styles.touchableIconContainer}
        >
          <Icon name="close" type="antdesign" color={ROOMER_GRAY} />
        </TouchableOpacity>
        <form onSubmit={this.handleOnSubmit} className="profileForm">
          <textarea
            type="text"
            value={this.state.profile}
            onChange={this.onChangeText}
            placeholder="Your profile description..."
          />
          <div className="submitBtnContainer">
            <input type="submit" value="Save" className="submitBtn" />
          </div>
        </form>
      </View>
    );
  }
}

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false, //sets to true if api call fails
      userId:
        props.navigation.state.params.owner == "1"
          ? ""
          : props.navigation.state.params.id,
      imageUrl:
        "https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/general_user.png",
      profileName: "ROOMER USER",
      profileDescription: "",
      rating: 5,
      ratings: [
        {
          author: "Ralf_Peterson",
          rating: 4.5,
          content:
            "Sally was great to work with, even though we didn't end up being a good match she was quick to respond and very helpful.",
        },
        {
          author: "jane_acreman_",
          rating: 1,
          content: "I hated Sally. Super flakey and mean.",
        },
      ],
      messagesSent: [],
      showTab: null,
      showEditOverlay: false,
      viewerIsUser: props.navigation.state.params.owner == "1",
    };

    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        let id = this.state.viewerIsUser ? user.username : this.state.userId;
        this.setState({
          showTab: (
            <PostsTab
              userId={id}
              token={user.signInUserSession.accessToken}
              showUnresolved={this.state.viewerIsUser}
            />
          ),
          imageUrl: `https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/${id}`,
          token: user.signInUserSession.accessToken,
        });

        if (this.state.viewerIsUser) {
          this.setState({
            userId: id,
            profileName: user.attributes.name,
          });
        } else {
          getUsername(id).then((response) => {
            if (response != -1) {
              this.setState({ profileName: response.Item.USERNAME });
            } else {
              this.setState({ error: true });
            }
          });
        }

        getUserAccountBio(id, user.signInUserSession.accessToken).then(
          (response) => {
            if (response != -1) {
              this.setState({ profileDescription: response.Item.USER_BIO });
            } else {
              this.setState({ error: true });
            }
          }
        );
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  onPressEdit = () => {
    //Edit profile message
    this.setState((prevState) => ({
      ...prevState,
      showEditOverlay: !this.state.showEditOverlay,
    }));
  };

  onEdit(profileDescription) {
    //Edit profile message
    this.setState((prevState) => ({
      ...prevState,
      profileDescription: profileDescription,
    }));
  }

  updateShowTabs(ratings, messages, posts) {
    if (ratings) {
      this.setState((prevState) => ({
        ...prevState,
        showTab: <RatingsTab ratings={this.state.ratings} />,
      }));
    } else if (messages) {
      this.setState((prevState) => ({
        ...prevState,
        showTab: (
          <MessagesTab
            userId={this.state.userId}
            token={this.state.token}
            messagesSent={this.state.messagesSent}
          />
        ),
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        showTab: (
          <PostsTab
            userId={this.state.userId}
            token={this.state.token}
            showUnresolved={this.state.viewerIsUser}
          />
        ),
      }));
    }
  }

  render() {
    if (!this.state.error) {
      return (
        <>
          <Header />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.accountContainer}
          >
            <View style={!isMobile ? styles.row : styles.userHeader}>
              <View style={[styles.imageColumn]}>
                <Image
                  source={{
                    uri: this.state.imageUrl,
                  }}
                  style={[styles.profileImage]}
                />
                {this.state.viewerIsUser ? (
                  <EditImageComponent userId={this.state.userId} />
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.column}>
                <Text style={styles.profileName}>{this.state.profileName}</Text>
                <Text style={[styles.profileDescription]}>
                  {this.state.profileDescription}
                </Text>
                <View style={!isMobile ? styles.row : styles.column}>
                  <Rating
                    type="star"
                    ratingCount={5}
                    startingValue={this.state.rating}
                    style={styles.setRating}
                    jumpValue={0.5}
                    onSwipeRating={(number) => {}}
                  />
                  <Text style={styles.ratingsText}>
                    {!isMobile ? "ratings" : " "}
                  </Text>
                  {this.state.viewerIsUser ? (
                    <Button
                      title="Edit Profile"
                      onPress={this.onPressEdit}
                      style={styles.editButton}
                    />
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.tabContainer}>
              <div
                id="posts"
                className="selectedTab"
                onClick={() => {
                  document.getElementById("ratings").className = "tab";
                  document.getElementById("messages")
                    ? (document.getElementById("messages").className = "tab")
                    : null;
                  document.getElementById("posts").className = "selectedTab";
                  this.updateShowTabs(false, false, true);
                }}
              >
                Posts
              </div>
              <div
                id="ratings"
                className="tab"
                onClick={() => {
                  document.getElementById("ratings").className = "selectedTab";
                  document.getElementById("messages")
                    ? (document.getElementById("messages").className = "tab")
                    : null;
                  document.getElementById("posts").className = "tab";
                  this.updateShowTabs(true, false, false);
                }}
              >
                Ratings
              </div>
              {this.state.viewerIsUser ? (
                <div
                  id="messages"
                  className="tab"
                  onClick={() => {
                    document.getElementById("ratings").className = "tab";
                    document.getElementById("messages")
                      ? (document.getElementById("messages").className = "tab")
                      : null;
                    document.getElementById("posts").className = "tab";
                    this.updateShowTabs(false, true, false);
                  }}
                >
                  Messages
                </div>
              ) : (
                <></>
              )}
            </View>
            {this.state.showTab}
            <Overlay
              overlayStyle={styles.overlayStyle}
              isVisible={this.state.showEditOverlay}
              onBackdropPress={this.onPressEdit}
            >
              <EditProfileOverlay
                props={{
                  profile: this.state.profileDescription,
                  onPressEdit: this.onPressEdit,
                  onEdit: this.onEdit,
                  userId: this.state.userId,
                }}
              />
            </Overlay>
          </ScrollView>
        </>
      );
    } else {
      return <Text style={[styles.errorContainer]}>An error occurred.</Text>;
    }
  }
}

const ROOMER_GRAY = "#1f241a";
const ROOMER_BLUE = "#5587a2";

const styles = StyleSheet.create({
  accountContainer: {
    //border: '2px solid #000',
    flexDirection: "column",
    margin: "4%",
    marginTop: "2%",
    minWidth: !isMobile ? 820 : "",
  },
  errorContainer: {
    flexDirection: "column",
    margin: "10%",
    color: "red",
    borderRadius: 60,
    border: "2px solid #000",
    textAlign: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  profileName: {
    fontSize: "1.5em",
    fontWeight: "600",
  },
  profileDescription: {
    marginRight: "5%",
    marginLeft: !isMobile ? "0%" : "5%",
    marginVertical: "3%",
    fontSize: "1em",
    flexWrap: "wrap",
    textAlign: !isMobile ? "auto" : "center",
  },
  ratingsText: {
    fontStyle: "italic",
    marginLeft: !isMobile ? "5%" : "",
    marginRight: !isMobile ? "30%" : "",
    fontSize: "1em",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: !isMobile ? "flex-start" : "center",
  },
  column: {
    flexDirection: "column",
    alignItems: !isMobile ? "flex-start" : "center",
    padding: "4%",
    flex: 1,
  },
  userHeader: {
    flexDirection: "column",
    // alignItems: !isMobile ? 'flex-start' : 'center',
    margin: "4%",
    // flex: 1,
  },
  editButton: {
    backgroundColor: "#aaaaaa",
    color: "#000",
    border: "2px solid #000",
    width: "100%",
  },
  setRating: {
    pointerEvents: "none",
  },
  tabContainer: {
    flexDirection: "row",
  },
  uploadPictureText: {
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  imageColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  editOverlayContainer: {
    height: !isMobile ? win.height - 300 : win.height,
    width: !isMobile ? 400 : win.width - 20,
  },
  editOverlayInput: {
    height: win.height - 300 - 50,
    width: 400 - 50,
  },
  touchableIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default Account;
