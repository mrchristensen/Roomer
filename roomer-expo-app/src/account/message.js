import React, { useContext, Component } from "react";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Overlay, Icon } from "react-native-elements";
import "../feed/Form.css";
import ExpandedISO from "../feed/expandedIso.js";

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const TagItem = ({ props }) => {
  return <Text style={[styles.tag]}>{props}</Text>;
};

function epochToDateString(epoch) {
  var d = new Date(epoch);
  var options = { year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("en-US", options);
}

//ISO post object as seen in feed, not the full view of it
class Message extends Component {
  onPress = () => {
    //Expanded version of ISO
    this.setState((prevState) => ({
      ...prevState,
      expanded: !this.state.expanded,
    }));
  };

  constructor(props) {
    super(props);

    this.state = {
      props: props.props,
      postDate: epochToDateString(props.props.postedDate),
      moveDate: epochToDateString(props.props.startDate),
      expanded: false,
      resolvedIndicator:
        props.props.STATUS === "resolved" ? (
          <View style={[styles.resolvedIcon]}>
            <Icon
              name="check-circle"
              type="feather"
              color={ROOMER_BLUE}
              style={{ marginRight: 10 }}
            />
            {"   resolved"}
          </View>
        ) : (
          <></>
        ),
    };
  }

  render() {
    return (
      <View style={[styles.isoContainer]}>
        <View style={[styles.rowContainer]}>
          <Image
            source={{
              uri: `https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/${this.state.props.userID}`,
            }}
            style={[styles.profileImage]}
          />
          <View style={[styles.isoContentContainer]}>
            <Text style={[styles.topInfoRow]}>
              x: {this.state.props.housingType}
              {", Price: $"}
              {this.state.props.minCost}
              {" - $"}
              {this.state.props.maxCost}
              {", Location: "}
              {this.state.props.location}
            </Text>
            <Text style={[styles.datePostedRow]}>
              Move-in: {this.state.moveDate}
            </Text>
            {this.state.resolvedIndicator}
            <Text
              style={[styles.isoContentText]}
              numberOfLines={2}
              ellipsizeMode={"tail"}
            >
              {this.state.props.isoPost}
            </Text>
            <FlatList
              style={[styles.tagRow]}
              data={this.state.props.tags}
              renderItem={({ item }) => <TagItem props={item} />}
              listKey={(item, index) => "tag" + index.toString()}
            />
            <TouchableOpacity style={styles.detailsText} onPress={this.onPress}>
              <>Details/Contact</>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.isoBorder}>{}</View>
        <Overlay
          overlayStyle={styles.overlayStyle}
          isVisible={this.state.expanded}
          onBackdropPress={this.onPress}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.expandedScrollview}
            // showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={this.onPress}
              style={styles.touchableIconContainer}
            >
              <Icon name="close" type="antdesign" color={ROOMER_GRAY} />
            </TouchableOpacity>
            <ExpandedISO
              props={{ iso: this.state.props, onPress: this.onPress }}
            />
          </ScrollView>
        </Overlay>
      </View>
    );
  }
}

const ROOMER_GRAY = "#1f241a";
const ROOMER_BLUE = "#5587a2";

const styles = StyleSheet.create({
  isoContainer: !isMobile
    ? {
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: "100%",
        fontFamily: "sans-serif",
      }
    : {
        paddingVertical: 20,
        fontFamily: "sans-serif",
      },
  isoBorder: {
    width: "84%",
    borderColor: ROOMER_GRAY,
    borderBottomWidth: 1,
    height: 25,
    marginLeft: "8%",
  },
  rowContainer: !isMobile
    ? {
        flexDirection: "row",
      }
    : {
        flexDirection: "row",
        width: win.width * 0.95,
      },
  isoContentContainer: {
    flexDirection: "column",
    width: "80%",
    paddingRight: "3%",
  },
  profileImage: !isMobile
    ? {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginRight: 40,
      }
    : {
        width: win.width * 0.15,
        height: win.width * 0.15,
        borderRadius: (win.width * 0.15) / 2,
        marginRight: 10,
        marginLeft: 10,
      },
  profileImageWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: !isMobile ? 20 : 0,
  },
  topInfoRow: {
    flexDirection: "row",
    fontWeight: "bold",
    width: "100%",
  },
  resolvedIcon: {
    flexDirection: "row",
    alignItems: "center",
    fontStyle: "italic",
    fontWeight: "normal",
  },
  resolvedButtonIcon: {
    marginRight: 10,
  },
  datePostedRow: {
    flexDirection: "row",
    color: "gray",
    marginTop: 5,
    marginBottom: 10,
  },
  isoContentText: {
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 20,
  },
  tagRow: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    paddingBottom: !isMobile ? 0 : 20,
  },
  actionRow: {
    flexDirection: "row",
    width: !isMobile ? 150 : win.width,
    justifyContent: !isMobile ? "flex-end" : "center",
    cursor: "pointer",
  },
  actionItem: {
    flexDirection: "column",
    marginRight: 15,
    fontSize: 10,
    color: "gray",
    textAlign: "center",
  },
  tag: {
    backgroundColor: ROOMER_GRAY,
    marginRight: 7,
    padding: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 5,
    color: "white",
    shadowColor: ROOMER_GRAY,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsText: {
    color: ROOMER_BLUE,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  touchableIconContainer: {
    alignItems: "flex-end",
  },
  cancelIcon: {
    height: 20,
    width: 20,
    margin: 10,
  },
  overlayStyle: {
    borderRadius: 15,
  },
  expandedScrollview: {
    width: !isMobile ? 820 : win.width,
    height: !isMobile ? win.height - 200 : win.height,
    fontFamily: "sans-serif",
  },
});

export default Message;
