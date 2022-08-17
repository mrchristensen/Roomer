import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useState } from "react";
import MapView from "react-native-web-maps";
import { getCoordinates } from "../ServerFacade";
import Dropdown from "./filterDropDown";
import { AiOutlineSearch } from "react-icons/ai";
import { IconContext } from "react-icons";
import Slider from "@react-native-community/slider";
import { BsCurrencyDollar } from "react-icons/bs";
import { AiTwotoneCalendar } from "react-icons/ai";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";
import FilterTags from "./filterTags";
import "./filter.css";

const win = Dimensions.get("window");

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};

const Filter = (props) => {
  const [price, setSliderPrice] = useState(100);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [homeTypeValue, setHomeType] = useState("");
  const [roomTypeValue, setRoomType] = useState("");
  const [layoutValue, setLayout] = useState("");
  const [selectedTags, setSelectedTags] = useState(null);
  const mapRef = React.createRef();

  let intialRegion = {
    latitude: 40.2338,
    longitude: -111.6585,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  };

  let filterValues = {
    homeType: null,
    location: null,
    price: null,
    moveInDate: null,
    tags: null,
    roomType: null,
    layout: null,
  };

  const homeType = [
    {
      id: 0,
      title: "Apartment",
      selected: false,
      key: "home-type",
    },
    {
      id: 1,
      title: "House",
      selected: false,
      key: "home-type",
    },
  ];

  const layoutList = [
    {
      id: 0,
      title: "Studio",
      selected: false,
      key: "layout",
    },
    {
      id: 1,
      title: "1-Room",
      selected: false,
      key: "layout",
    },
    {
      id: 2,
      title: "Shared",
      selected: false,
      key: "layout",
    },
  ];

  const roomType = [
    {
      id: 0,
      title: "Private Room",
      selected: false,
      key: "room-type",
    },
    {
      id: 1,
      title: "Shared Room",
      selected: false,
      key: "room-type",
    },
  ];

  function applyPriceToFilter() {
    applyFilter();
  }

  function numberWithCommas(x) {
    setSliderPrice(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }

  function setHomeTypeProperties(item) {
    if (item.key == "home-type") {
      setHomeType(item.title);
    } else if (item.key == "room-type") {
      setRoomType(item.title);
    } else if (item.key == "layout") {
      setLayout(item.title);
    }
  }

  function setMap() {
    getCoordinates(location).then((response) => {
      if (response.status == 200) {
        let coordinates = response.data.results[0].geometry.location;
        mapRef.current.animateToRegion({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0,
        });
      }
    });
  }

  function onSubmitLocation(e) {
    e.preventDefault();
    setMap();
  }

  function confirmSelectedTags(updatedSelectedTags) {
    if (updatedSelectedTags.length == 0) {
      setSelectedTags(null);
    } else {
      setSelectedTags(updatedSelectedTags);
    }
  }

  function applyFilter() {
    console.log(filterValues);
    filterValues.homeType = homeTypeValue;
    filterValues.location = location;
    filterValues.price =
      typeof price == "string" ? parseInt(price.replaceAll(/,/g, "")) : price;
    filterValues.moveInDate = startDate;
    filterValues.tags = selectedTags;
    filterValues.roomType = roomTypeValue;
    filterValues.layout - layoutValue;
    props.filterValuesSet(filterValues);
  }

  useDidMountEffect(applyFilter, [
    homeTypeValue,
    location,
    price,
    startDate,
    selectedTags,
    roomTypeValue,
    layoutValue,
  ]);

  return (
    <View style={styles.filterContainer}>
      <div className="filter-header-container">
        <h2 className="filter-header">Search Filters</h2>
      </div>
      <div className="filter-body-container">
        <div className="home-type-container">
          <h2 className="filter-body-header">Home Type</h2>
          <Dropdown
            title="Select Home Type"
            list={homeType}
            setHomeTypeProperties={setHomeTypeProperties}
          />
          <h2 className="filter-body-header">Layout</h2>
          <Dropdown
            title="Select Layout"
            list={layoutList}
            setHomeTypeProperties={setHomeTypeProperties}
          />
          <h2 className="filter-body-header">Room Type</h2>
          <Dropdown
            title="Select Room Type"
            list={roomType}
            setHomeTypeProperties={setHomeTypeProperties}
          />
        </div>
        <div className="location-container">
          <h2 className="filter-body-header">Location</h2>
          <div className="map-container">
            <MapView
              ref={mapRef}
              style={styles.mapStyle}
              initialRegion={intialRegion}
            />
          </div>
          <div className="location-search-container">
            <form
              className="location-input"
              onSubmit={(e) => onSubmitLocation(e)}
            >
              <input
                type="text"
                placeholder="Enter a location"
                onChange={(e) => setLocation(e.target.value)}
              />
              <button type="submit" className="location-button">
                <IconContext.Provider value={{ className: "search-icon" }}>
                  <AiOutlineSearch />
                </IconContext.Provider>
              </button>
            </form>
          </div>
        </div>
        <div className="price-container">
          <h2 className="filter-body-header">Price</h2>
          <div className="price-body-container">
            <IconContext.Provider value={{ className: "dollar-icon" }}>
              <BsCurrencyDollar />
            </IconContext.Provider>
            <input
              className="price-input"
              type="text"
              value={price}
              readOnly={true}
            />
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.filterSlider}
                minimumValue={100}
                maximumValue={8000}
                thumbTintColor="#5c6565"
                minimumTrackTintColor="#a3a39d"
                maximumTrackTintColor="#a3a39d"
                step={50}
                onValueChange={(sliderValue) => numberWithCommas(sliderValue)}
                onSlidingComplete={applyPriceToFilter}
              />
            </View>
          </div>
        </div>
        <div className="date-container-filter">
          <h2 className="filter-body-header">Move-In Date</h2>
          <div className="date-body">
            <DatePicker value={startDate} onChange={setStartDate} />
            <IconContext.Provider value={{ className: "calendar-icon" }}>
              <AiTwotoneCalendar />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <FilterTags confirmSelectedTags={confirmSelectedTags} />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    width: 425,
    height: "60%",
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  filterSlider: {
    width: 270,
    height: 40,
    alignSelf: "center",
  },
  sliderContainer: {
    alignItems: "center",
  },
});

export default Filter;
