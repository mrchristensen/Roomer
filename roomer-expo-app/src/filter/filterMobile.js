import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useState} from 'react';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Slider from '@react-native-community/slider';
import Dropdown from './filterDropDown';
import'./filter.css'
import { IconContext } from 'react-icons';
import { responsiveWidth } from "react-native-responsive-dimensions";
import { AiOutlineSearch } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import DatePicker from 'react-modern-calendar-datepicker';
import { AiTwotoneCalendar } from "react-icons/ai"
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import FilterTags from './filterTags';

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
      if (didMount.current) {
          func();
      } else {
          didMount.current = true;
      }
  }, deps);
}

const FilterMobile = (props) => {
  const [price, setSliderPrice] = useState(100);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [homeTypeValue, setHomeType] = useState("");
  const [roomTypeValue, setRoomType] = useState("");
  const [layoutValue, setLayout] = useState("");
  const [selectedTags, setSelectedTags] = useState(null);

  let filterValues = {
    homeType: null,
    location: null,
    price: null,
    moveInDate: null,
    tags: null,
    roomType: null,
    layout: null
  };


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

  function applyPriceToFilter() {
    applyFilter();
  }

  function numberWithCommas(x) {
    setSliderPrice(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }

  function setHomeTypeProperties(item) {
    if (item.key == "home-type") {
        setHomeType(item.title);
    } else if (item.key == "room-type") {
        setRoomType(item.title);
    } else if (item.key == "layout") {
        setLayout(item.title)
    }
  }

  function confirmSelectedTags(updatedSelectedTags) {
    setSelectedTags(updatedSelectedTags);
  }

  function applyFilter() {
    filterValues.homeType = homeTypeValue;
    filterValues.location = location;
    filterValues.price = (typeof(price) == "string" ? parseInt(price.replaceAll(/,/g, '')): price);
    filterValues.moveInDate = startDate;
    filterValues.tags = selectedTags;
    filterValues.roomType = roomTypeValue;
    filterValues.layout - layoutValue;
    // props.filterValuesSet(filterValues);
    console.log(filterValues);
  }

  useDidMountEffect(applyFilter, [homeTypeValue, location, price, startDate, selectedTags, roomTypeValue, layoutValue]);

  return (
    <Collapse>
      <CollapseHeader>
        <View style={styles.filterMobileButton}>
          <Text style={styles.buttonText}>Search Filter</Text>
        </View>
      </CollapseHeader>
      <CollapseBody style={styles.collapseBody}>
        <div className='home-type-container'>
          <h2 className='filter-header'>Home Type</h2>
          <Dropdown
            title='Select Home Type'
            list={homeType}
            setHomeTypeProperties={setHomeTypeProperties}
          />
          <h2 className='filter-header'>Layout</h2>
          <Dropdown 
            title='Select Layout'
            list={layoutList}
            setHomeTypeProperties={setHomeTypeProperties}
          />
          <h2 className='filter-header'>Room Type</h2>
          <Dropdown 
            title='Select Room Type'
            list={roomType}
            setHomeTypeProperties={setHomeTypeProperties}
          />
        </div>
        <div className='location-container'>
          <h2 className='filter-header'>Location</h2>
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
        </div>
        <div className='price-container'>
          <h2 className='filter-header'>Price</h2>
            <div className='price-body-container'>
              <IconContext.Provider value={{className: "dollar-icon"}}>
                <BsCurrencyDollar />
              </IconContext.Provider>
              <input className='price-input' type='text' value={price}/>
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
        <div className='date-container-filter'>
          <h2 className='filter-header'>Move-In Date</h2>
            <div className='date-body'>
              <DatePicker 
                value={startDate}
                onChange={setStartDate}
              />
              <IconContext.Provider value={{className: "calendar-icon"}}>
                <AiTwotoneCalendar />
              </IconContext.Provider>
              </div>
        </div>
        <FilterTags confirmSelectedTags={confirmSelectedTags} />
      </CollapseBody>
    </Collapse>
  );
};

const styles = StyleSheet.create({
  filterMobileButton: {
    borderStyle: 'solid',
    backgroundColor: '#1e2419',
    borderRadius: 20,
    borderColor: '#b3b4b1',
    borderWidth: 2,
    width: responsiveWidth(30),
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 2
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500'
  },
  collapseBody: {
    width: '100%',
    backgroundColor: '#dcdcdc',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 6
  },
  filterSlider: {
        width: 204,
        height: 20,
        alignSelf: 'center'
  },
});

export default FilterMobile;
