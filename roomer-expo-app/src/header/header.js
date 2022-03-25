import React, {Component, useState} from 'react';
import {Dimensions} from 'react-native';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import './header.css'
import RoomerLogo from './roomer.svg'
import ProfilePicture from '../menu/profilePucture';
import {Icon} from 'react-native-elements';
import AuthenticationCard from '../authentication/AuthenticationCard.js'
import { Auth } from 'aws-amplify'
import AddPost from '../homeBanner/addPost';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

class Header extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userInfo: null,
            signInClick: false,
            showAddPostOverlay: false,
            isHome: true,
            firstName: null
        };
    }

    onClickSignIn = (event) => {
        this.setState({signInClick: true})
    }

    onClickBackdrop = (event) => {
        this.setState({signInClick: false})
    }

    onLogout = async () => {
        try {
            await Auth.signOut();
        } catch (e) {
        }
        this.setState({
            isLoggedIn: false,
            userInfo: null,
            signInClick: false,
        })
    }

    onClickFindAPlace = () => {
        this.setState({showAddPostOverlay: !this.state.showAddPostOverlay});
    }
    
    componentDidMount() {
        this._isMounted = true;

        Auth.currentAuthenticatedUser().then(user => {
            let names = user["attributes"]["name"].split(" ");
            let parsedUser = {
                Username: user["username"],
                FirstName: names[0],
                LastName: names[1],
                Email: user["attributes"]["email"]
            }
            if (this._isMounted) {
                this.setState(prevState => ({
                    ...prevState,
                    isLoggedIn: true,
                    userInfo: parsedUser,
                    signInClick: false,
                    isHome: true,
                    firstName: parsedUser.FirstName
                }));
            }
        }).catch(() => {
            if (this._isMounted) {
                    this.setState(prevState => ({
                    ...prevState,
                    isLoggedIn: false,
                    userInfo: null,
                    signInClick: false,
                    isHome: true,
                    firstName: null
                }));
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    findABuyerIcon = <div className='icon-wrapper'>
        { !isMobile ? "Find a Buyer" : ""}
        <Icon           
        name='search'
        type='feather'
        color={"#fff"}
        style={{marginLeft: !isMobile ? 4 : 10}}
        size={15}
    />
    </div>

    render() {
        return (
            <div className='header-container'>
                <div className='header-options__left'>
                    <div className='options-wrapper'>
                        <span 
                            className='options underline-hover-effect'
                            onClick={this.onClickFindAPlace}
                            >
                            <div className='icon-wrapper'>
                                {!isMobile ? "Find a Place" : ""}
                                <Icon           
                                name='plus'
                                type='feather'
                                color={"#fff"}
                                style={{marginLeft: 4}}
                                size={15}
                                />
                            </div>
                        </span>
                        {
                            this.state.isHome ? (
                                <span className='options underline-home-effect'>
                                {this.findABuyerIcon}
                                </span>
                            ) : (
                                <span className='options underline-hover-effect'>
                                {this.findABuyerIcon}
                                </span>
                            )
                        }
                    </div>
                </div>
                <div className='roomer-logo-container'>
                    <a className='roomer-logo-link'>
                        <img className='roomer-logo' src={RoomerLogo} alt='Roomer logo'/>
                    </a>
                </div>
                {
                    this.state.isLoggedIn ? (
                        <div className='header-options__right'>
                            <div className='options-wrapper__right'>
                                <span className='options-feedback underline-hover-effect' onClick={(event) => {
                                        const url = "https://forms.gle/JAabcmxMyKfQh32Z9";
                                        window.open(url);
                                }}>Feedback</span>
                                <ProfilePicture onLogout={this.onLogout} firstName={this.state.firstName} />
                            </div>
                        </div>
                    ) : (
                        <div className='header-options__right-not-logged-in'>
                            <div className='options-wrapper'>
                                <span className='options underline-hover-effect' onClick={(event) => {
                                    const url = "https://forms.gle/4VD4FtyyP1KvNLz38";
                                    window.open(url);
                                }}>Feedback</span>
                                <span className='options underline-hover-effect' onClick={this.onClickSignIn}>Sign In / Register</span>
                            </div>
                        </div>
                    )
                }
                <Overlay isVisible={this.state.signInClick} onBackdropPress={this.onClickBackdrop}>
                    <AuthenticationCard exitNoLogin={() => {
                        this.setState({ signInClick: false, })
                    }} exitMenu={(user) => 
                        this.setState({
                            signInClick: false,
                            isLoggedIn: true,
                            userInfo: user,
                            isHome: true,
                            firstName: user.FirstName
                        })} />
                </Overlay>
                <Overlay isVisible={this.state.showAddPostOverlay} onBackdropPress={this.onClickFindAPlace}>
                    <AddPost props={{onPress: this.onClickFindAPlace}}/>
                </Overlay>
            </div>
        );
    }
}

export default Header;