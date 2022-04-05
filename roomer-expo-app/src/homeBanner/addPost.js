import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import { AiTwotoneCalendar, AiOutlineSearch } from 'react-icons/ai';
import { Icon } from 'react-native-elements';
import { IconContext } from 'react-icons';
import MapView from 'react-native-web-maps';
import DatePicker from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import '../filter/filterDropDown.css';
import '../filter/filter.css';
import './AddPost.css';
import { getCoordinates, addPost } from '../ServerFacade';
import Dropdown from '../filter/filterDropDown';
import {Auth} from 'aws-amplify';
import FilterTags from '../filter/filterTags';
import ExpandedISO from '../feed/expandedIso';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const AddPost = ({props}) => {
  
  const [min, onChangeMin] = useState(0);
  const [max, onChangeMax] = useState(0);
  const [dateRange, onChangeDateRange] = useState({from: null, to: null});
  const [homeTypeValue, setHomeType] = useState("");
  const [roomTypeValue, setRoomType] = useState("");
  const [layoutValue, setLayout] = useState("");
  const [message, onChangeMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [userID, setUserID] = useState(props.userID);
  const [tagUpdate, triggerTagUpdate] = useState(false);
  let mapRef = React.createRef();
  let markerRef = React.createRef();
  const [location,setLocation] = useState("Provo");

  const [previewISO, setPreview] = useState({
    status: "unresolved", 
    postedDate: "",
    startDate: dateRange.from === null ? null : new Date(dateRange.from.year, dateRange.from.month-1, dateRange.from.day),
    endDate: dateRange.to === null ? null : new Date(dateRange.to.year, dateRange.to.month-1, dateRange.to.day),
    userID: userID,
    _id: -1,
    housingType: homeTypeValue,
    minCost: min,
    maxCost: max,
    location: location,
    isoPost: message,
    tags: selectedTags
  });

  useEffect(() => {
    setPreview({
        status: "unresolved", 
        postedDate: "",
        startDate: dateRange.from === null ? null : new Date(dateRange.from.year, dateRange.from.month-1, dateRange.from.day),
        endDate: dateRange.to === null ? null : new Date(dateRange.to.year, dateRange.to.month-1, dateRange.to.day),
        userID: userID,
        _id: -1,
        housingType: homeTypeValue,
        minCost: min,
        maxCost: max,
        location: location,
        isoPost: message,
        tags: selectedTags
      });
  }, [dateRange, message, homeTypeValue, min, max, location, tagUpdate]);


  const homeType = [
    {
        id: 0,
        title: 'Apartment',
        selected: false,
        key: 'home-type'
    },
    {
        id: 1,
        title: 'House',
        selected: false,
        key: 'home-type'
    },
  ] 

  const layoutList = [
      {
          id: 0,
          title: 'Studio',
          selected: false,
          key: 'layout'
      },
      {
          id: 1,
          title: '1-Room',
          selected: false,
          key: 'layout'
      },
      {
          id: 2,
          title: 'Shared',
          selected: false,
          key: 'layout'
      }
  ]

  const roomType = [
      {
          id: 0,
          title: 'Private Room',
          selected: false,
          key: 'room-type'
      },
      {
          id: 1,
          title: 'Shared Room',
          selected: false,
          key: 'room-type'
      }
  ] 

  function setHomeTypeProperties(item) {
    if (item.key == "home-type") {
        setHomeType(item.title);
    } else if (item.key == "room-type") {
        setRoomType(item.title);
    } else if (item.key == "layout") {
        setLayout(item.title)
    }
  }

  let intialRegion = {
    latitude: 40.2338,
    longitude: -111.6585,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  };

  let markerCoordinate = {
    latitude: intialRegion.latitude,
    longitude: intialRegion.longitude
  };

  function onSubmitLocation(e) {
    e.preventDefault();
    setMap();
}

  function setMap() {
    if (location == "") return;
    getCoordinates(location).then(response => {
      if (response.status == 200) {
        let coordinates = response.data.results[0].geometry.location;
        markerCoordinate.latitude = coordinates.lat;
        markerCoordinate.longitude = coordinates.lng;

        mapRef.current.animateToRegion({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.2
        });
      }
    });
  }

  async function handleOnSubmit(event) {
    event.preventDefault();
    let user = await Auth.currentAuthenticatedUser();

    if (user == null) {
      //TODO: handle error
    } else {
      let startDateFormatted = new Date(dateRange.from.year, dateRange.from.month-1, dateRange.from.day);
      let endDateFormatted = new Date(dateRange.to.year, dateRange.to.month-1, dateRange.to.day);

      let success = await addPost(user.username, message, location, homeTypeValue, roomTypeValue, layoutValue, min, max, selectedTags, startDateFormatted, endDateFormatted, user.signInUserSession.accessToken);
      
      if (success == -1) {
        //TODO: handle error
      }
      
      window.location.reload();
    }
  }

  function confirmSelectedTags(updatedSelectedTags) {
    triggerTagUpdate(!tagUpdate);
    setSelectedTags(updatedSelectedTags);
  }

  return (
    <ScrollView 
      contentInsetAdjustmentBehavior="automatic"
      style={styles.addPostScrollview}
      showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        onPress={props.onPress}
        style={styles.touchableIconContainer}>
        <Icon           
          name='close'
          type='antdesign'
          color={ROOMER_GRAY}
        />
      </TouchableOpacity>
      <View style={styles.addPostContainer}>
        <h3>Add Post</h3>
    
        <div className="postform-box">
          <View style={styles.textBox}>
            <Text>{"Price"}</Text>
            <Text>{"Move-In Date"}</Text>
          </View>
          <form onSubmit={handleOnSubmit}>
            <div className={'price-date-wrapper'}>
              <div className="range-container">
                <div className="value-box">
                  <span className='dollar-prefix'>$</span>
                  <input 
                    type="text"
                    value={min}
                    onChange={(event) => {onChangeMin(event.target.value)}}
                    placeholder=""/>
                </div>
                <label>
                  {" - "}
                </label>
                <div className="value-box">
                  <span className='dollar-prefix'>$</span>
                  <input 
                    type="text"
                    value={max}
                    onChange={(event) => {onChangeMax(event.target.value)}}
                    placeholder="" />
                </div>
              </div>
              <div className='date-wrapper'>
                <DatePicker 
                  value={dateRange}
                  onChange={onChangeDateRange}
                />
                <IconContext.Provider value={{className: "calendar-icon"}}>
                  <AiTwotoneCalendar />
                </IconContext.Provider>
              </div>
            </div>
            <View style={styles.typeTextBox}>
              <Text>Home Type</Text>
              <Text>Layout</Text>
              <Text>Room Type</Text>
            </View>
            <View style={styles.typeDropdownBox}>
              <div className='add-post-dropdown'>
              <Dropdown
                title='Select'
                list={homeType}
                setHomeTypeProperties={setHomeTypeProperties}
              />
              </div>
              <div className='add-post-dropdown'>
              <Dropdown 
                title='Select'
                list={layoutList}
                setHomeTypeProperties={setHomeTypeProperties}
              />
              </div>
              <div className='add-post-dropdown'>
              <Dropdown 
                title='Select'
                list={roomType}
                setHomeTypeProperties={setHomeTypeProperties}
              />
              </div>
            </View>
            <h4>Description</h4>
            <textarea
              type="text"
              value={message}
              onChange={(event) => {onChangeMessage(event.target.value)}}
              placeholder="Add a message to your post..." />
          </form>
          <div className={!isMobile ? 'tag-map-wrapper' : 'tag-map-wrapper_mobile'}>
            <div className='tag-map-sub-wrapper'>
            <FilterTags confirmSelectedTags={confirmSelectedTags} />
            </div>
            <div className='tag-map-sub-wrapper'>
              <div className='location-container'>
                <h2 className='filter-body-header'>Location</h2>
                <div className='location-search-container'>
                  <form className='location-input' onSubmit={(e) => onSubmitLocation(e)}>
                    <input type="text" placeholder="Enter a location" onChange={(e) => setLocation(e.target.value)}/>
                    <button type='submit' className='location-button'>
                      <IconContext.Provider value={{className: "search-icon"}}>
                        <AiOutlineSearch />
                      </IconContext.Provider>
                    </button>
                  </form>
                </div>
                <div className='map-container'>
                  <MapView
                    ref = {mapRef}
                    style={styles.mapStyle}
                    initialRegion={intialRegion}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='submitBtnWrapper'>
            <input
              type="submit"
              value="Post"
              className="submitBtn"
              onClick={handleOnSubmit} />
          </div>
        </div>
        <View style={styles.isoBorderExpanded}>{}</View>
        <h3>Preview Post</h3>
        <ExpandedISO props={{iso: previewISO, onPress: () => {}}} key={previewISO}/>
      </View>
    </ScrollView >
  );
};

const ROOMER_GRAY = "#1f241a";
const ROOMER_BLUE = "#5587a2";

const styles = StyleSheet.create({
  addPostContainer: {
    flexDirection: 'column',
    marginHorizontal: !isMobile ? 100 : .05 * win.width,
    fontFamily: 'sans-serif'
  },
  addPostScrollview: {
    width: !isMobile ? 800 : win.width,
    height: !isMobile ? win.height - 200 : win.height,
  },
  textBox: {
    color: ROOMER_GRAY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: !isMobile ? 600 : .9 * win.width,
    marginBottom: 10,
  },
  typeTextBox: {
    color: ROOMER_GRAY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: !isMobile ? 600 : .9 * win.width,
    marginTop: 20,
  },
  typeDropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: !isMobile ? 600 : .9 * win.width,
  },
  touchableIconContainer: {
    alignItems: "flex-end"
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
  },
  isoBorderExpanded: {
    width: !isMobile ? 360 : "100%",
    borderColor: ROOMER_GRAY,
    borderBottomWidth: 1,
    height: 25,
    marginLeft: !isMobile ? 120 : 0,
  },
});


export default AddPost;