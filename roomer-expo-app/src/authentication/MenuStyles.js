import {
    StyleSheet,
} from 'react-native';


const styles = StyleSheet.create({
    menuStyle: {
        width: 270,
        maxHeight: 500,
    },
    cognitoButtonStyle: {
        backgroundColor: 'black',
        height: 35,
    },
    cognitoButtonTextStyle: {
        color: 'white',
        fontSize: 14,
        fontWeight: "500",
    },
    googleButtonStyle: {
        backgroundColor: '#e0e0e0',
        height: 35,
    },
    googleButtonTextStyle: {
        fontSize: 14,
        fontWeight: "500"
    },
    facebookButtonStyle: {
        backgroundColor: '#4267B2',
        height: 35,
    },
    facebookButtonTextStyle: {
        color: 'white',
        fontSize: 14,
        fontWeight: "500"
    },
    textInputStyle: {
        height: 35,
        backgroundColor: '#dcdcdc',
        padding: 5,
        borderWidth: .5,
        borderStyle: 'solid',
        borderRadius: 5,
        marginBottom: 30,
        fontSize: 14,
        fontWeight: "300"
    },
    categoryTextStyle: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "300"
    },
    registerHintTextStyle: {
        alignSelf: "center",
        marginBottom: 20
    },
    hyperLinkStyle: {
        color: '#237395',
        marginBottom: 30,
        alignSelf: 'center',
        fontSize: 14
    },

});

export default styles