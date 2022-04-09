import React, { Component, useState, useContext } from "react";
import { Dimensions, StyleSheet, ImageBackground, Text } from "react-native";
import {
  NavigationContext,
  withNavigation,
  NavigationActions,
  Link,
} from "react-navigation";
import bannerImage from "./banner.jpeg";
import { Overlay } from "react-native-elements/dist/overlay/Overlay";
import "./header.css";
import RoomerLogo from "./roomer.svg";
import ProfilePicture from "../menu/profilePucture";
import { Icon } from "react-native-elements";
import AuthenticationCard from "../authentication/AuthenticationCard.js";
import { Auth } from "aws-amplify";
import AddPost from "../homeBanner/addPost";
import { ConsoleLogger } from "@aws-amplify/core";

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const ROOMER_GRAY = "#1f241a";

const OnClickFindABuyerHeader = (props) => {

  const findABuyerIcon = (
    <div className="icon-wrapper">
      {!isMobile ? "Find a Buyer" : ""}
      <Icon
        name="search"
        type="feather"
        color={"#fff"}
        style={{ marginLeft: !isMobile ? 4 : 2 }}
        size={15}
      />
    </div>
  );
  
  const navigation = useContext(NavigationContext);
  let isHome = true;

  return isHome ? (
    <span
      className="options underline-home-effect"
      onClick={() => {
        if(navigation.state.routeName !== "Home") {
          navigation.navigate("Home")
        }
      }}
    >
      {findABuyerIcon}
    </span>
  ) : (
    <span 
      className="options underline-hover-effect"
      onClick={() => {
        if(navigation.state.routeName !== "Home") {
          navigation.navigate("Home")
        }
      }}
    >
      {findABuyerIcon}
    </span>
  )
};

const OnClickFindABuyerBanner = (props) => {

  const navigation = useContext(NavigationContext);

  return <span
  className="icon-wrapper"
  style={{
    backgroundColor: ROOMER_GRAY,
    padding: 8,
    borderRadius: 10,
  }}
  onClick={() => {
    if(navigation.state.routeName !== "Home") {
      navigation.navigate("Home")
    }
  }}
  >
    <Text style={styles.buttonText}>I'm looking for a buyer </Text>
    <Icon name="search" type="feather" color={"#fff"} size={16} />
  </span>
}

class Header extends Component {
  _isMounted = false;
  mountedContext = null;

  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      userInfo: { Username: "" },
      signInClick: false,
      showAddPostOverlay: false,
      isHome: true,
      firstName: null,
    };
  }

  onClickSignIn = (event) => {
    this.setState({ signInClick: true });
  };

  onClickBackdrop = (event) => {
    this.setState({ signInClick: false });
  };

  onLogout = async () => {
    try {
      await Auth.signOut();
    } catch (e) {}
    this.setState({
      isLoggedIn: false,
      userInfo: null,
      signInClick: false,
    });
  };

  onClickFindAPlace = () => {
    this.setState({ showAddPostOverlay: !this.state.showAddPostOverlay });
  };

  componentDidMount() {
    this._isMounted = true;
    this.mountedContext = this.context;

    Auth.currentAuthenticatedUser()
      .then((user) => {
        let names = user["attributes"]["name"].split(" ");
        let parsedUser = {
          Username: user["username"],
          FirstName: names[0],
          LastName: names[1],
          Email: user["attributes"]["email"],
        };
        if (this._isMounted) {
          this.setState((prevState) => ({
            ...prevState,
            isLoggedIn: true,
            userInfo: parsedUser,
            signInClick: false,
            isHome: true,
            firstName: parsedUser.FirstName,
          }));
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            ...prevState,
            isLoggedIn: false,
            userInfo: null,
            signInClick: false,
            isHome: true,
            firstName: null,
          }));
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        <div className="header-container">
          <div className="header-options__left">
            <div className="options-wrapper">
              {this.state.isLoggedIn ? (
                <span
                  className="options underline-hover-effect"
                  onClick={this.onClickFindAPlace}
                >
                  <div className="icon-wrapper">
                    {!isMobile ? "Find a Place" : ""}
                    <Icon
                      name="plus"
                      type="feather"
                      color={"#fff"}
                      style={{ marginLeft: 4 }}
                      size={15}
                    />
                  </div>
                </span>
              ) : (
                <></>
              )}
              <OnClickFindABuyerHeader isHome={this.state.isHome}/>
            </div>
          </div>
          <div className="roomer-logo-container">
            <a className="roomer-logo-link">
              <img className="roomer-logo" src={RoomerLogo} alt="Roomer logo" />
            </a>
          </div>
          {this.state.isLoggedIn ? (
            <div className="header-options__right">
              <div className="options-wrapper__right">
                <span
                  className="options-feedback underline-hover-effect"
                  onClick={(event) => {
                    const url = "https://forms.gle/JAabcmxMyKfQh32Z9";
                    window.open(url);
                  }}
                >
                  Feedback
                </span>
                <ProfilePicture
                  onLogout={this.onLogout}
                  firstName={this.state.firstName}
                />
              </div>
            </div>
          ) : (
            <div className="header-options__right-not-logged-in">
              <div className="options-wrapper__right">
                <span
                  className="options underline-hover-effect"
                  onClick={(event) => {
                    const url = "https://forms.gle/4VD4FtyyP1KvNLz38";
                    window.open(url);
                  }}
                >
                  Feedback
                </span>
                <span
                  className="options underline-hover-effect"
                  onClick={this.onClickSignIn}
                >
                  Sign In / Register
                </span>
              </div>
            </div>
          )}
          <Overlay
            isVisible={this.state.signInClick}
            onBackdropPress={this.onClickBackdrop}
          >
            <AuthenticationCard
              exitNoLogin={() => {
                this.setState({ signInClick: false });
              }}
              exitMenu={(user) =>
                this.setState({
                  signInClick: false,
                  isLoggedIn: true,
                  userInfo: user,
                  isHome: true,
                  firstName: user.FirstName,
                })
              }
            />
          </Overlay>
          {this.state.isLoggedIn ? (
            <Overlay
              isVisible={this.state.showAddPostOverlay}
              onBackdropPress={this.onClickFindAPlace}
            >
              <AddPost
                props={{
                  onPress: this.onClickFindAPlace,
                  userID: this.state.userInfo.Username,
                }}
              />
            </Overlay>
          ) : (
            <></>
          )}
        </div>
        <div>
          <ImageBackground // https://stackoverflow.com/questions/49250047/how-to-place-a-text-over-image-in-react-native
            source={bannerImage}
            style={{ width: "100%", height: 300 }}
          >
            <Text style={styles.bannerText}>
              Post what you are in search of{"\n"}Find your buyer here
            </Text>

            {this.state.isLoggedIn ? (
              <div
                style={{ position: "absolute", bottom: "25%", right: ".5%" }}
                className="options"
                onClick={this.onClickFindAPlace}
              >
                <span
                  className="icon-wrapper"
                  style={{
                    backgroundColor: ROOMER_GRAY,
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  <Text style={styles.buttonText}>
                    I'm looking for a place to rent{" "}
                  </Text>
                  <Icon name="plus" type="feather" color={"#fff"} size={16} />
                </span>
              </div>
            ) : (
              <></>
            )}

            <div
              style={{ position: "absolute", bottom: "10%", right: ".5%" }}
              className="options"
            >
              <OnClickFindABuyerBanner/>
            </div>
          </ImageBackground>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: ROOMER_GRAY,
    padding: 9,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  bannerText: {
    fontSize: 38,
    position: "absolute",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    top: "15%",
    right: "2%",
    textAlign: "right",
  },
});

export default Header;
