import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, Text} from 'react-native';
import {getFeed} from '../ServerFacade';
import ISO from './iso';

const win = Dimensions.get("window");
const isMobile = win.width < 600;

class Feed extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      pageSize: props.props.pageSize,
      lastPostId: null,
      housingType: null,
      location: null,
      housingPrice: null,
      moveInDate: null,
      tags: null,
      roomType: null,
      layout: null,
      page: [],
      loading: true,
      isEnd: false,
      error: false,
      fromFilter: false,
      setUpdateFeedState: props.setUpdateFeedState
    };
    
    this.state.setUpdateFeedState(this.updateState)
  }

  updateState = (updatedFeedProps) => {
    this.setState({
      pageSize: updatedFeedProps.pageSize,
      lastPostId: null,
      housingType: updatedFeedProps.housingType,
      location: updatedFeedProps.location,
      housingPrice: updatedFeedProps.housingPrice,
      moveInDate: updatedFeedProps.moveInDate,
      tags: updatedFeedProps.tags,
      fromFilter: true
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.fromFilter) {
      this.state.fromFilter = false;
      getFeed(this.state.pageSize, this.state.lastPostId, this.state.housingType, this.state.location, this.state.housingPrice, this.state.moveInDate, this.state.tags, this.state.roomType, this.state.layout).then(response => {
        if (response != -1) {
          this.setState({
            page: response,
            isEnd: true
          });
        }
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;
    
    getFeed(this.state.pageSize).then(response => {
      if (this._isMounted) {
        if (response != -1) {
          this.setState(prevState => ({
            ...prevState,
            lastPostId: response[response.length - 1]._id,
            page: response,
            loading: false,
            isEnd: response.length === 0,
            error: false,
          }));

        } else {
          this.setState(prevState => ({
            ...prevState,
            error: true
          }));
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onEndReached = () => {
    if (this.state.isEnd) {
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      loading: true,
    }));

    getFeed(
      this.state.pageSize,
      this.state.lastPostId,
    ).then(response => {

      if (response != -1) {
        let newPage = this.state.page.concat(response);

        this.setState({
          pageSize: this.state.pageSize,
          lastPostId: response.length > 0 ? response[response.length - 1]._id : this.state.lastPostId,
          page: newPage,
          loading: false,
          isEnd: response.length === 0,
          error: false,
        });

      } else {
        this.setState(prevState => ({
          ...prevState,
          error: true
        }));
      }
    });
  };

  render() {
    if(!this.state.error) {
      return (
        <FlatList
          style={[styles.feedContainer]}
          data={this.state.page}
          renderItem={({item}) => <ISO props={item} />}
          keyExtractor={(item) => item._id}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
        />
      );
    } else {
      return (
        <Text
          style={[styles.errorContainer]} >
            An error occurred.
        </Text>
      )
    }
  }
}

const styles = StyleSheet.create({
  feedContainer: !isMobile ? {
    paddingRight: '2%',
    height: win.height,
    width: '40%',
  } : {
    height: win.height,
  },
  errorContainer: {
    flexDirection: "column",
    marginHorizontal: !isMobile ? '2%' : 0,
    height: 500,
    width: !isMobile ? '40%' : win.width - 20,
    color: 'red',
    borderRadius: 60,
    border: !isMobile ? '2px solid #000' : '',
    textAlign: 'center',
  }
});

export default Feed;
