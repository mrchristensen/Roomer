import React, { useState } from "react";

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Overlay } from 'react-native-elements';
import './Banner.css';
import AddPost from './addPost.js';
import AuthenticationCard from "../authentication/AuthenticationCard.js"

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const SliderData = [
  {
    image: "https://www.jetsetter.com//uploads/sites/7/2018/04/biweyMdJ-1380x1035.jpeg",
  },
  {
    image: "https://coolwallpapers.me/picsup/3072487-architectural_architecture_building_design_estate_exterior_front_home_house_old_red_stone_windows.jpg",//"https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/06/featured-photo-types-of-doors.jpeg.jpg",
  },
  {
    image: "https://mocah.org/uploads/posts/580373-architecture.jpg",
  },
]

const HomeBanner = ({props}) => {

  const [current, setCurrent] = useState(0);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);

  const nextSlide = () => {
    console.log(current);
    setCurrent(current === SliderData.length - 1 ? 0 : current + 1)
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? SliderData.length - 1 : current - 1)
    console.log(current);
  };

  const toggleAddPost = () => {
    console.log("add post!")
    setIsAddPostOpen(!isAddPostOpen)
  }

  return (
    <View style={styles.bannerContainer}>
      <FaArrowAltCircleLeft className="leftArrow" onClick={prevSlide} />
      <FaArrowAltCircleRight className="rightArrow" onClick={nextSlide} />
      {SliderData.map((slide, index) => {
        return (
          <Image
              style={index === current ? styles.banner : styles.bannerInactive}
              source={{
                uri: slide.image,
              }}
              resizeMode={"cover"}
          />
        );
      })}
      <div className={!isMobile ? "bannerTitle" : "bannerTitleMobile"}>find your buyer here.</div>
      {props.loggedIn && !isMobile ? 
      <div 
        className="addPostButton"
        onClick={toggleAddPost}>
        <AiFillPlusCircle className="plusIcon" />
        I'm looking for a place
      </div> :  props.loggedIn ? 
      <AiFillPlusCircle 
        className="plusIconMobile"
        onClick={toggleAddPost} /> : null}
      <Overlay 
        isVisible={isAddPostOpen}
        onBackdropPress={toggleAddPost}>
        <AuthenticationCard props={{onPress: toggleAddPost}} />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    height: !isMobile ? win.height * .5 : win.height * .25,
    width: "100%",
  },
  banner: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
  },
  bannerInactive: {
    height: 0,
    width: 0,
  },
});


export default HomeBanner;