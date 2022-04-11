import React, {useContext, Component} from 'react';
import {
  Dimensions,
  FlatList,
  View,
  Text, 
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationContext } from "react-navigation";
import './Form.css';
import { sendSESEmail } from '../AWS';
import {Auth} from 'aws-amplify';
import { resolvePostStatus, unresolvePostStatus, getUserEmail, getUsername, addMessage, getCoordinates } from '../ServerFacade';
import AddPost from '../homeBanner/addPost';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const TagItem = ({props}) => {
  return <Text style={[styles.tag]}>{props}</Text>;
};

function epochToDateString(epoch) {
  if(epoch === null || !epoch) return "";
  var d = new Date(epoch);
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString("en-US", options);
}

const UserPageLink = ({id, name, isOwner, exitCallback}) => {
  const navigation = useContext(NavigationContext);

  return <TouchableOpacity
    style={styles.detailsText} 
    onPress={() => {
      navigation.navigate("Profile", {
        owner: isOwner ? 1 : 0,
        id: id,
      });
      exitCallback();
    }}>
    <>
    {name}
    </>
  </TouchableOpacity>;
}

class ExpandedISO extends Component {

  constructor(props) {
    super(props);

    //TODO: make this based on the actual login value
    const notLoggedIn = false;
    
    this.state = {
      emailValue: "",
      subjectValue: "",
      messageValue: "",
      notLoggedIn: notLoggedIn,
      contactMessage: notLoggedIn ? "You must login to contact this buyer" : "Contact",
      resolvedIndicator: props.props.iso.status === "resolved" ? 
      <View style={[styles.resolvedIcon]}>
        <Icon           
          name='check-circle'
          type='feather'
          color={ROOMER_BLUE}
          style={{marginRight: 10}}
        />{"   resolved"}</View>: <></>,
      viewerIsAuthor: false, 
      statusResolveMessage: props.props.iso.status === "resolved" ? "Re-Post" : "Unpost",
      name: "",
      editMode: false,
      coordinates: null,
    }

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeStatus = this.handleOnChangeStatus.bind(this);
    this.ActionItem = this.ActionItem.bind(this);
    this.selectEditMode = this.selectEditMode.bind(this);

    this.ownerActions = this.props.props.iso._id === -1 ? [] : [
      {
        name: this.state.statusResolveMessage,
        icon: <Icon 
          name='check-circle'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: this.handleOnChangeStatus
      },
      {
        name: "Edit",
        icon: <Icon  
          name='edit'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: this.selectEditMode
      },
    ]

    this.nonOwnerActions = [
      /*{ TODO: implement all non-owner actions
        name: "Flag",
        icon: <Icon    
          name='flag'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: () => console.log("Flag")
      },
      {
        name: "Save",
        icon: <Icon  
          name='bookmark'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: () => console.log("Save")
      },
      {
        name: "Share",
        icon: <Icon    
          name='share'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: () => console.log("Share")
      },*/
    ]
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser().then(user => {
      this.setState(prevState => ({
        ...prevState,
        notLoggedIn: false,
        contactMessage: "Contact",
        viewerIsAuthor: user.username === this.props.props.iso.userID,
        token: user.signInUserSession.accessToken,
        viewerId: user.username,
      }));

      if(user.username === this.props.props.iso.userID) {
        this.setState({name: user.attributes.name});
      } else {
        getUsername(this.props.props.iso.userID).then(response => {
          this.setState({name: response.Item.USERNAME});
        });
      }
    }).catch(() => {
      this.setState(prevState => ({
        ...prevState,
        notLoggedIn: true,
        contactMessage: "You must login to contact this buyer",
      }));
    });
  }

  ActionItem(props) {
    return <TouchableOpacity style={styles.actionItem} onPress={props.onClick}>
      {props.icon}
      <>{props.name}</>
    </TouchableOpacity>;
  }

  async handleOnSubmit(event) {
    event.preventDefault();

    if(this.state.emailValue != "" && this.state.subjectValue != "" && this.state.messageValue != "") {
      //send email
      let toEmailValue = await getUserEmail(this.props.props.iso.userID, this.state.token);
      if (toEmailValue == -1) {
        //TODO: error handling
      } else {
        sendSESEmail(toEmailValue, this.state.emailValue, this.state.subjectValue, this.state.messageValue);
        let addMessageError = await addMessage(this.state.viewerId, this.props.props.iso._id, this.state.subjectValue, this.state.messageValue, this.props.props.iso.userID, this.state.token);
        if(addMessageError == -1) {
          //TODO: error handling
        }
      }

      //close expanded iso
      this.props.props.onPress();
    }
  }

  async handleOnChangeStatus(event) {
    event.preventDefault();

    if(this.props.props.iso._id === -1) return;

    let error = this.props.props.iso.status === "resolved" 
      ? await unresolvePostStatus(this.props.props.iso.userID, this.props.props.iso._id, this.state.token)
      : await resolvePostStatus(this.props.props.iso.userID, this.props.props.iso._id, this.state.token);
    if(error == -1) {
      //TODO: handlerror
    } else {
      var newIsoProps = this.props.props;
      newIsoProps.iso.status = newIsoProps.iso.status === "resolved" ? "unresolved" : "resolved";
      this.setState({
        statusResolveMessage: this.state.statusResolveMessage === "Re-Post" ? "Unpost" : "Re-Post",
        props: newIsoProps
      });
    }

    //close expanded iso
    this.props.props.onPress();
  }

  async selectEditMode() {

    let response = await getCoordinates(this.props.props.iso.location);
    if(response.status == 200) {
      let coordinateLocation = response.data.results[0].geometry.location;
      this.setState({coordinates: {
        latitude: coordinateLocation.lat,
        longitude: coordinateLocation.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05
      },
      editMode: true});
    }
  }

  handleEmailChange = (event) => {
    this.setState({emailValue: event.target.value});
  }

  handleSubjectChange = (event) => {
    this.setState({subjectValue: event.target.value});
  }

  handleMessageChange = (event) => {
    this.setState({messageValue: event.target.value});
  }

  render() {
    return this.state.editMode 
    ? (<AddPost props={{onPress: this.props.props.onPress, userID: this.state.viewerId, iso: this.props.props.iso, initialRegion: this.state.coordinates }}/>) 
    : (<View style={styles.expandedIsoContainer}>
        <View style={styles.expandedIsoInfoContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{
                uri: `https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/${this.props.props.iso.userID}`,
              }}
              style={[styles.profileImageExpanded]}
            />
            <UserPageLink id={this.props.props.iso.userID} name={this.state.name} isOwner={this.state.viewerIsAuthor} exitCallback={this.props.props.onPress}/>
          </View>
          <View style={[styles.isoContentContainerExpanded]}>
            <Text style={[styles.topInfoRowExpanded]}>
            Type: {this.props.props.iso.housingType}
              {', Price: $'}
              {this.props.props.iso.minCost}
              {' - $'}
              {this.props.props.iso.maxCost}
              {', Location: '}
              {this.props.props.iso.location}
            </Text>
            <Text style={[styles.datePostedRow]}>
              Posted: {epochToDateString(this.props.props.iso.postedDate)}
            </Text>
            <Text style={[styles.datePostedRow]}>
              Move-in: {epochToDateString(this.props.props.iso.startDate) + " - " + epochToDateString(this.props.props.iso.endDate)}
            </Text>
            {this.state.resolvedIndicator}
            <Text
              style={[styles.isoContentText]}>
              {this.props.props.iso.isoPost}
            </Text>
            <View style={{flexDirection: !isMobile ? "row" : "column"}}>
              <FlatList
                style={[styles.tagRowExpanded]}
                contentContainerStyle={styles.tagRowContentContainer}
                data={this.props.props.iso.tags}
                renderItem={({item}) => <TagItem props={item} />}
                listKey={(item, index) => 'tag' + index.toString()}
              />
              <FlatList
                style={[styles.actionRow]}
                contentContainerStyle={styles.actionRowContentContainer}
                data={this.state.notLoggedIn ? [] : this.state.viewerIsAuthor ? this.ownerActions : this.nonOwnerActions}
                renderItem={({item}) => this.ActionItem(item)}
                listKey={(item, index) => item.name}
              />
            </View>
            <View style={styles.isoBorderExpanded}>{}</View>
          </View>
        </View>
        <div className={this.state.viewerIsAuthor ? "form-box-invisible" : "form-box"} >
          <h3>{this.state.contactMessage}</h3>
          <form onSubmit = {this.handleOnSubmit}>
            <label>
              Your email
              <input 
                type="text"
                value={this.state.emailValue}
                onChange={this.handleEmailChange} 
                placeholder="seller@email.com"
                disabled={this.state.notLoggedIn}/>
            </label>
            <label>
              Subject
              <input 
                type="text"
                value={this.state.subjectValue}
                onChange={this.handleSubjectChange} 
                placeholder="Perfect housing for you!"
                disabled={this.state.notLoggedIn}/>
            </label>
            <label>
              Message
              <textarea
                type="text"
                value={this.state.messageValue}
                onChange={this.handleMessageChange} 
                placeholder="Message..."
                disabled={this.state.notLoggedIn}/>
            </label>
            <div className='submitBtnContainer'>
            <input
              type="submit"
              value="Submit"
              className="submitBtn"
              disabled={this.state.notLoggedIn}/>
            </div>
          </form>
        </div>
      </View>
    );
  }
};

const ROOMER_GRAY = "#1f241a";
const ROOMER_BLUE = "#5587a2";

const styles = StyleSheet.create({
  isoContainer: !isMobile ? {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    fontFamily: 'sans-serif'
  } : {
    paddingVertical: 20,
    fontFamily: 'sans-serif'
  },
  isoBorder: {
    width: "84%",
    borderColor: ROOMER_GRAY,
    borderBottomWidth: 1,
    height: 25,
    marginLeft: "8%",
  },
  isoBorderExpanded: {
    width: !isMobile ? 360 : win.width * .9,
    borderColor: ROOMER_GRAY,
    borderBottomWidth: 1,
    height: 25,
    marginLeft: !isMobile ? 70 : 0,
  },
  rowContainer: !isMobile ? {
    flexDirection: 'row',
  } : {
    flexDirection: 'row',
    width: win.width * .95,
  },
  isoContentContainer: {
    flexDirection: 'column',
    width: "80%",
    paddingRight: "3%",
  },
  isoContentContainerExpanded: {
    flexDirection: 'column',
    paddingTop: !isMobile ? 0 : 10,
    width: !isMobile ? 650 : win.width*.9,
  },
  profileImage: !isMobile ? {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginRight: 40,
  } : {
    width: win.width * .15,
    height: win.width * .15,
    borderRadius: win.width * .15 / 2,
    marginRight: 10,
  },
  profileImageExpanded: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileImageWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: !isMobile ? 20 : 0,
  },
  topInfoRow: {
    flexDirection: 'row',
    fontWeight: 'bold',
    width: '100%',
  },
  resolvedIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
  resolvedButtonIcon: {
    marginRight: 10,
  },
  topInfoRowExpanded: {
    flexDirection: 'row',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  datePostedRow: {
    flexDirection: 'row',
    color: 'gray',
    marginTop: 5,
    marginBottom: 10,
  },
  isoContentText: {
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  tagRowExpanded: {
    flexDirection: 'row',
    width: !isMobile ? 500 : win.width*.9,
    flexWrap: 'wrap',
    paddingBottom: !isMobile ? 0 : 20,
    marginHorizontal: !isMobile ? 0 : win.width*.05,
  },
  tagRowContentContainer: {
    flexDirection: 'row',
    width: !isMobile ? 500 : win.width*.9,
    flexWrap: 'wrap',
  },
  actionRow: {
    flexDirection: 'row',
    width: !isMobile ? 150 : win.width,
    cursor: "pointer",
  },
  actionRowContentContainer: {
    justifyContent: !isMobile ? 'flex-end' : 'center',
  },
  actionItem: {
    flexDirection: 'column',
    marginRight: 15,
    fontSize: 10,
    color: "gray",
    textAlign: 'center',
  },
  tag: {
    backgroundColor: ROOMER_GRAY,
    marginRight: 7,
    padding: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 5,
    color: 'white',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  expandedIsoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  expandedIsoInfoContainer: {
    flexDirection: !isMobile ? 'row' : 'column',
    alignItems: !isMobile ? 'flex-start' : 'center',
    textAlign: !isMobile ? 'auto' : 'center',
    padding: !isMobile ? 0 : 10,
    paddingTop: 5,
  },
  expandedScrollview: {
    width: !isMobile ? 820 : win.width,
    height: !isMobile ? win.height - 200 : win.height,
    fontFamily: 'sans-serif'
  },
  touchableIconContainer: {
    alignItems: "flex-end"
  },
  cancelIcon: {
    height: 20,
    width: 20,
    margin: 10,
  },
  overlayStyle: {
    borderRadius: 15,
  }
});

export default ExpandedISO;