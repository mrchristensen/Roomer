import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
} from 'react-native';
import'./profilePicture.css';
import Dropdown from './dropdown';
import {Auth} from 'aws-amplify';

const ProfilePicture = (props) => {

    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/general_user.png");

    Auth.currentAuthenticatedUser().then(user => {
      setImageUrl(`https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/${user.username}`);
    }).catch(() => {
      setImageUrl("https://AWS_BUCKET_NAME.s3.us-east-2.amazonaws.com/general_user.png");
    });

    return (
        <div className='profile-picture-contaier'>
            <View style={styles.profileImageContainer}>
                <Image 
                    source={{
                        uri: imageUrl
                    }}
                    style={styles.profileImage}/>
            </View> 
            <span className='user-greeting profile-underline-hover-effect' onClick={() => {setOpen(!open)}}>Hello 
            {
                props.firstName == null ? " Undefined" : " " + props.firstName
            }</span>
            {
                open ? (
                    <Dropdown onLogout={props.onLogout} />
                ) : (
                    null
                )
            }
        </div>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row',
        width: 170,
        height: 0,
        margin: 22
    },
    profileImageContainer: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        marginLeft: 12,
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
    },
    userGreeting: {
        fontSize: 13,
        color: '#ffffff',
        alignSelf: 'center',
        marginLeft: 10,
    }
});

export default ProfilePicture;