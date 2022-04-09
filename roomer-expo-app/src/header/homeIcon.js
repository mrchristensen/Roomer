import React, {Component, useContext} from 'react';
import {Dimensions} from 'react-native';
import { Header } from 'react-native-elements';
import { NavigationContext } from "react-navigation";
import {Icon} from 'react-native-elements';
import './header.css';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

const HomeIcon = () => {
    const navigation = useContext(NavigationContext);

    return (
        <span className='options underline-hover-effect'  onClick={() => {navigation.navigate("Home")}}>
            <div className='icon-wrapper'>
            { !isMobile ? "Find a Buyer" : ""}
                <Icon           
                name='search'
                type='feather'
                color={"#fff"}
                style={{marginLeft: !isMobile ? 4 : 2}}
                size={15}
                />
            </div>
        </span>
    )
}

export default HomeIcon;