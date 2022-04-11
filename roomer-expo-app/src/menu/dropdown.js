import React from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import './dropdown.css';
import { NavigationContext } from "react-navigation";
import { useContext } from "react";

const Dropdown = (props) => {
    const navigation = useContext(NavigationContext);

    return (
        <div className='drop-down'>
            <div className='menu-item' onClick={(event) => {
                if(navigation.state.routeName !== 'Profile') {
                  navigation.navigate("Profile", {
                    owner: 1,
                    id: "",
                  });
                } else if (navigation.state.params.owner === '0') {
                  navigation.navigate("Profile", {
                    owner: 1,
                    id: "",
                  });
                  location.reload()
                }
            }}>
                <span>
                    <Icon 
                        name='account-circle'
                        color={'#ffffff'} />
                </span>
                <span className='item-title'>My Account</span>
            </div>
            <div className='menu-item' onClick={(event) => {
                props.onLogout();
            }}>
                <span>
                    <Icon 
                        name='logout'
                        color={'#ffffff'}/>
                </span>
                <span className='item-title'>Logout</span>
            </div>
        </div>
    )
}

const styles = StyleSheet.create({
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
    },
    icons: {
        color: '#ffffff'
    }
})

export default Dropdown;