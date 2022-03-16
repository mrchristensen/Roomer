import React, {Component, useContext} from 'react';
import './header.css';
import RoomerLogo from './roomer.svg';
import { NavigationContext } from "react-navigation";

const BareHeader = (props) => {

  const navigation = useContext(NavigationContext);

  return (
    <div className='bare-header-container'>
        <a className='roomer-logo-link'>
            <img className='roomer-logo' src={RoomerLogo} alt='Roomer logo' onClick={() => {navigation.navigate("Home")}}/>
        </a>
    </div>
  );
}

export default BareHeader;