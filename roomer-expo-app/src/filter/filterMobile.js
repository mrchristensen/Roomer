import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  CheckBox,
  TextInput,
  Button,
  Picker
} from 'react-native';
import {useState} from 'react';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Slider from '@react-native-community/slider';
import { responsiveWidth } from "react-native-responsive-dimensions";

const FilterMobile = (props) => {
  const [isSelectedHouse, setSelectionHouse] = useState(false);
  const [isSelectedApartment, setSelectionApartment] = useState(false);
  // const [location, onChangeLocation] = React.useState(null);
  const [location,setLocation] = useState("provo");
  const [date, onChangeDate] = useState(null);
  const [keyword, onChangeKeyWord] = useState(null);
  const [price, setSliderPrice] = useState(100);

  function getFilterValues() {
    return {
      selectApartment: isSelectedApartment,
      selectHouse: isSelectedHouse,
      price: price,
      location: location,
      date: date
    };
  }

  function onSet() {
    props.filterValuesSet(getFilterValues());
  }

  return (
    <Collapse>
      <CollapseHeader>
        <View style={styles.filterMobileButton}>
          <Text>Set Filter</Text>
        </View>
      </CollapseHeader>
      <CollapseBody style={styles.collapseBody}>
        <View style={styles.filterMobileContainer}>
        <TextInput 
        style={styles.filterMainTextInputKeyWord}
        onChangeText={onChangeKeyWord}
        value={keyword}
        placeholder="Filter buyer listings..."/>
          <View style={styles.mainCheckboxContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelectedHouse}
                onValueChange={setSelectionHouse}
                style={styles.checkbox}
              />
              <Text style={styles.label}>House</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isSelectedApartment}
                onValueChange={setSelectionApartment}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Apartment</Text>
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.priceTextContainer}>
              <Text style={styles.sliderText}>${price}</Text>
            </View>
            <Slider
              style={styles.filterSlider}
              minimumValue={100}
              maximumValue={8000}
              thumbTintColor="#A9A9A9"
              minimumTrackTintColor="#202121"
              maximumTrackTintColor="#A9A9A9"
              step={100}
              onValueChange={(sliderValue) => setSliderPrice(sliderValue)}
            />
            <View style={styles.priceLabelContainer}>
              <Text>$100</Text>
              <Text style={styles.maxPrice}>$8,000</Text>
            </View>
          </View>
          <SafeAreaView style={styles.filterTextInputContainer}>
            <Picker
              style={styles.pickerStyles}
              selectedValue={location}
              onValueChange={(itemValue, itemIndex) => {
                setLocation(itemValue);
              }}>
              <Picker.Item label="Provo" value="provo" />
              <Picker.Item label="Orem" value="orem" />
            </Picker>
            {/* <TextInput
              style={styles.filterTextInput}
              onChangeText={onChangeLocation}
              value={location}
              placeholder="Location"
            /> */}
            <TextInput
              style={styles.filterTextInputDate}
              onChangeText={onChangeDate}
              value={date}
              placeholder="Date YY-MM-DD"
            />
          </SafeAreaView>
          <View style={styles.filterButtonContainer}>
            <Button 
              title="Set filter" 
              onPress={() => onSet()}
            />
          </View>
        </View>
      </CollapseBody>
    </Collapse>
  );
};

const styles = StyleSheet.create({
  mainCheckboxContainer: {
    marginTop: 10,
    flexDirection: 'column',
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
  filterMobileButton: {
    color: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 20,
    width: responsiveWidth(30),
    alignItems: 'center',
  },
  filterMobileContainer: {
    marginTop: 10,
    height: 360,
    width: responsiveWidth(96.5),
    backgroundColor: '#e3e2e1',
    paddingLeft: 10,
    alignItems: 'center',
  },
  collapseBody: {
    marginRight: 50,
  },
  filterTextInput: {
    borderWidth: 2,
    width: 200,
    height: 20,
    padding: 5,
    borderRadius: 5,
  },
  filterTextInputContainer: {
    marginTop: 20,
  },
  datePicker: {
    width: 50,
  },
  filterTextInputDate: {
    marginTop: 10,
    borderWidth: 2,
    width: 200,
    height: 20,
    padding: 5,
    borderRadius: 5,
  },
  filterButtonContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
  },
  filterSlider: {
    width: 200,
    height: 40,
  },
  priceLabelContainer: {
    flexDirection: 'row',
    marginTop: 0,
  },
  maxPrice: {
    paddingLeft: 120,
  },
  filterMainTextInputKeyWord: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    padding: 3,
    width: '80%',
  },
  pickerStyles: {
    borderWidth: 2,
    width: 200,
    height: 23,
    borderRadius: 5,
    borderColor: 'black'
  },
  sliderText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  priceTextContainer: {
    backgroundColor: "#FFFFFF",
    width: 30,
    height: 30,
    justifyContent: 'center',
    borderRadius: 30 / 2,
    alignSelf: 'center'
  },
  sliderContainer: {
    marginTop: 10
  }
});

export default FilterMobile;
