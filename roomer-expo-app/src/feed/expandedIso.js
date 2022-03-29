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
import { resolvePostStatus, unresolvePostStatus, getUserEmail, getUsername } from '../ServerFacade';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const TagItem = ({props}) => {
  return <Text style={[styles.tag]}>{props}</Text>;
};

function epochToDateString(epoch) {
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

    console.log(props);
    
    this.state = {
      emailValue: "",
      subjectValue: "",
      messageValue: "",
      notLoggedIn: notLoggedIn,
      contactMessage: notLoggedIn ? "You must login to contact this buyer" : "Contact",
      postDate: epochToDateString(props.props.iso.postedDate),
      moveDate: epochToDateString(props.props.iso.startDate),
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
    }

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeStatus = this.handleOnChangeStatus.bind(this);
    this.ActionItem = this.ActionItem.bind(this);

    this.ownerActions = [
      {
        name: this.state.statusResolveMessage,
        icon: <Icon 
          name='check-circle'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: this.handleOnChangeStatus
      },
      /*{ TODO: implement edit post option
        name: "Edit",
        icon: <Icon  
          name='edit'
          type='feather'
          color={ROOMER_GRAY}
        />,
        onClick: () => console.log("Edit")
      },*/
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
      }

      //close expanded iso
      this.props.props.onPress();
    }
  }

  async handleOnChangeStatus(event) {
    event.preventDefault();

    if(this.props.props.iso._id === -1) return;

    let error = this.props.props.iso.status === "resolved" 
      ? await unresolvePostStatus(this.props.props.iso._id, this.state.token)
      : await resolvePostStatus(this.props.props.iso._id, this.state.token);
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
    return (
      <View style={styles.expandedIsoContainer}>
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
              Posted: {this.state.postDate}
            </Text>
            <Text style={[styles.datePostedRow]}>
              Move-in: {this.state.moveDate}
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
    width: !isMobile ? 360 : win.width * .8,
    borderColor: ROOMER_GRAY,
    borderBottomWidth: 1,
    height: 25,
    marginLeft: !isMobile ? 70 : "10%",
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
    width: !isMobile ? 650 : win.width,
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
  tagRow: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    paddingBottom: !isMobile ? 0 : 20,
  },
  tagRowExpanded: {
    flexDirection: 'row',
    width: !isMobile ? 500 : win.width,
    flexWrap: 'wrap',
    paddingBottom: !isMobile ? 0 : 20,
  },
  tagRowContentContainer: {
    justifyContent: !isMobile ? 'flex-start' : 'center',
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