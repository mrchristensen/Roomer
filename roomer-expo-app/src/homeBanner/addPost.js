import React, {Component, useState} from 'react';
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  CheckBox,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  Picker
} from 'react-native';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import MapView from 'react-native-web-maps';
import 'react-dates/initialize';
import './AddPost.css';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import { getCoordinates, addPost } from '../ServerFacade';
import {Auth} from 'aws-amplify';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const TagItem = ({props}) => {
  return <Text style={[styles.tag]}>{props}</Text>;
};

const AddPost = ({props}) => {
  
  const [isSelectedHouse, setSelectionHouse] = useState(false);
  const [isSelectedApartment, setSelectionApartment] = useState(false);
  // const [location, onChangeLocation] = useState("");
  const [min, onChangeMin] = useState(0);
  const [max, onChangeMax] = useState(0);
  const [startDate, onChangeStartDate] = useState(null);
  const [endDate, onChangeEndDate] = useState(null);
  const [focusedInput, onChangeFocusedInput] = useState(null);
  const [message, onChangeMessage] = useState("");
  const [tag, onChangeTag] = useState("");
  const [tagList, onChangeTagList] = useState([]);
  let mapRef = React.createRef();
  let markerRef = React.createRef();
  const [location,setLocation] = useState("Provo");

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

  function setMap() {
    if (location == "") return;
    getCoordinates(location).then(response => {
      if (response.status == 200) {
        let coordinates = response.data.results[0].geometry.location;
        markerCoordinate.latitude = coordinates.lat;
        markerCoordinate.longitude = coordinates.lng;
        console.log(mapRef.current);
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
      let type = isSelectedHouse && isSelectedApartment ? "House or Apartment" : isSelectedHouse ? "House" : isSelectedApartment ? "Apartment" : "";
      let startDateFormatted = new Date(startDate.locale("en").add(1, 'd').format("MMM DD, YYYY HH:MM"));
      let endDateFormatted = new Date(endDate.locale("en").add(1, 'd').format("MMM DD, YYYY HH:MM"));
      let success = await addPost(user.username, message, location, type, min, max, tagList, startDateFormatted, endDateFormatted, user.signInUserSession.accessToken);
      
      if (success == -1) {
        //TODO: handle error
      }
      
      window.location.reload();
    }
  }

  function addToTagList() {
    if(tag === "") return;
    let newTagList = tagList;
    newTagList.push(tag);
    onChangeTagList(newTagList);
    onChangeTag("");
  }

  return (
    <ScrollView 
      contentInsetAdjustmentBehavior="automatic"
      style={styles.addPostScrollview}
      showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        onPress={props.onPress}
        style={styles.touchableIconContainer}>
        <Image
          source={{
            uri: 'https://img.icons8.com/material-outlined/24/000000/cancel--v1.png',
          }}
          style={[styles.cancelIcon]}
        />
      </TouchableOpacity>
      <View style={styles.addPostContainer}>
        <h3>Add Post</h3>
    
        <div className="postform-box">
          <View style={styles.mainCheckboxContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelectedHouse}
                onValueChange={setSelectionHouse}
                style={styles.checkbox}
                color={'#7AC4CD'}
              />
              <Text style={styles.label}>House</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelectedApartment}
                onValueChange={setSelectionApartment}
                style={styles.checkbox}
                color={'#7AC4CD'}
              />
              <Text style={styles.label}>Apartment</Text>
            </View>
          </View>
          <div className="datePickerContainer">
            <DateRangePicker
              startDate={startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {onChangeStartDate(startDate); onChangeEndDate(endDate);}} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => onChangeFocusedInput(focusedInput)} // PropTypes.func.isRequired,
              startDatePlaceholderText={"Move-in start date"}
              endDatePlaceholderText={"Move-in end date"}
            /> 
          </div>
          <form onSubmit = {handleOnSubmit}>
            <div className="range-container">
              <label>
                Price Min $
              </label>
              <input 
                type="text"
                value={min}
                onChange={(event) => {onChangeMin(event.target.value)}}
                placeholder="" />
              <label>
                Price Max $
              </label>
              <input 
                type="text"
                value={max}
                onChange={(event) => {onChangeMax(event.target.value)}}
                placeholder="" />
            </div>
            <View style={styles.filterMainMapContainer}>
              <View style={styles.mapContainer}>
                <MapView
                  ref = {mapRef}
                  style={styles.mapStyle}
                  initialRegion={intialRegion}
                >
                  <MapView.Marker
                  ref = {markerRef}
                  coordinate={markerCoordinate}
                  />
                </MapView>
              </View>
              {/* <TextInput
                  style={styles.filterMainTextInputLocation}
                  onChangeText={onChangeLocation}
                  value={location}
                  placeholder="Location"
                /> */}
              <Picker
                style={styles.pickerStyles}
                selectedValue={location}
                onValueChange={(itemValue, itemIndex) => {
                  setLocation(itemValue);
                }}>
                <Picker.Item label="Provo" value="provo" />
                <Picker.Item label="Orem" value="orem" />
              </Picker>
              <AiOutlineSearch
                className="searchIcon"
                onClick={setMap}
                color={'#7AC4CD'} />
            </View>
            <textarea
              type="text"
              value={message}
              onChange={(event) => {onChangeMessage(event.target.value)}}
              placeholder="Add a message to your post..." />
            <div className="tag-container">
              <label>
                Tags
              </label>
              <input 
                type="text"
                value={tag}
                onChange={(event) => {onChangeTag(event.target.value)}}
                placeholder="Add tags" />
              <AiFillPlusCircle 
                className="addTagIcon"
                onClick={addToTagList}
                color={'#7AC4CD'} />
            </div>
            <div className="tag-container">
              <FlatList
                style={[styles.tagRow]}
                data={tagList}
                renderItem={({item}) => <TagItem props={item} />}
                listKey={(item, index) => 'tag' + index.toString()}
                flexDirection={'row'}
                horizontal={true}
              />
            </div>
            <input
              type="submit"
              value="Post"
              className="submitBtn" />
          </form>
        </div>
      </View>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#7AC4CD',
    marginRight: 7,
    padding: 5,
    paddingLeft: 10,
    borderRadius: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    border: '2px solid #8CDEE7',
    marginBottom: 5,
  },
  tagRow: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  addPostContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  addPostScrollview: {
    width: !isMobile ? 800 : win.width,
    height: !isMobile ? win.height - 200 : win.height,
  },
  touchableIconContainer: {
    alignItems: "flex-end"
  },
  cancelIcon: {
    height: 20,
    width: 20,
    margin: 10,
  },
  filterContainer: {
    height: 500,
    width: '25%',
    backgroundColor: '#e3e2e1',
    alignItems: 'center',
  },
  filterHeader: {
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#000000',
    width: '60%',
    borderRadius: 10,
    textAlign: 'center',
  },
  mainCheckboxContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  checkbox: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  mapContainer: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginRight: 20,
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
  },
  filterSlider: {
    width: 400,
    height: 40,
  },
  priceLabelContainer: {
    flexDirection: 'row',
    width: 400,
    marginTop: 0,
    justifyContent: 'space-between',
  },
  maxPrice: {
    paddingLeft: 120,
  },
  datePickerContainer: {
    justifyContent: 'center',
  },
  filterMainTextInputLocation: {
    width: '82%',
    padding: '.5rem 2% .5rem 2%',
    fontSize: 15,
  },
  filterMainMapContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  filterMainCalendarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterMainTextInputDate: {
    height: 25,
    width: '82%',
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  filterMainTextInputContainerDate: {
    top: 12,
    left: 17,
  },
  filterMainCalendarImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'black',
    right: 8,
    top: -38,
    backgroundColor: '#fada5e',
  },
  filterMainButtonContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
  },
  filterMainTextInputKeyWord: {
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    padding: 3,
    width: '80%',
  },
  pickerStyles: {
    height: 29,
    width: '20%',
    borderWidth: 1,
    borderColor: '#8CDEE7',
    padding: 'auto',
    borderRadius: 5
  }
});


export default AddPost;