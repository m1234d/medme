import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Buffer} from 'buffer';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.state = {firstName: " ", lastName: " ", image: "1", children: [], index: 0};
    this.apiUrl = "https://ancient-chipmunk-75.localtunnel.me/api/";
    if(this.props.screenProps.getMode() == "parent") {
      this.getChildren(this.props.screenProps.id);
    }
    else {
      this.getName(this.props.screenProps.id);
    }
  }
  getData(url) {
    return fetch(this.apiUrl + url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
  }
  getName(id) {
    this.getData("get_patient_by_id?id=" + id).then((responseJson) => {
      console.log(responseJson);
      this.setState(previousState => {
        console.log(responseJson);
        this.getQR(id);
        return { firstName: responseJson.rows[0].firstName, lastName: responseJson.rows[0].lastName };
      });

    });
  }
  getChildren(id) {
    this.getData("get_children?id=" + id).then((responseJson) => {
      console.log(responseJson);
      this.setState(previousState => {
        console.log(responseJson);
        this.getName(responseJson.children[0])

        return { children: responseJson.children};
      });

    });
  }
  getQR(id) {
    this.getData("get_patient_qr?id=" + id).then((responseJson) => {
      var buf = Buffer.from(responseJson.image_string, 'base64');
      console.log('data:image/png;base64,' + responseJson.image_string.substring(2));
      this.setState(previousState => {
        return { image: 'data:image/png;base64,' + responseJson.image_string.substring(2, responseJson.image_string.length-1)};
      });
    });
  }
  next() {
    console.log(this.props.screenProps.childCreated);
    if(this.props.screenProps.childCreated) {
      this.getChildren(this.props.screenProps.id);
      this.props.screenProps.childCreated(false);
    }
    this.setState(previousState => {
      if(previousState.index >= previousState.children.length - 1) {
        return {index: 0};
      }
      return {index: previousState.index + 1}
    });
    console.log(this.state.index);
    this.getName(this.state.children[this.state.index])

  }
  prev() {
    console.log(this.props.screenProps.childCreated);
    if(this.props.screenProps.childCreated) {
      this.getChildren(this.props.screenProps.id);
      this.props.screenProps.childCreated(false);
    }
    this.setState(previousState => {
      if(previousState.index <= 0) {
        return {index: previousState.children.length - 1};
      }
      return {index: previousState.index - 1}
    });
    this.getName(this.state.children[this.state.index]);

  }
  render() {
    console.log(this.props.screenProps.getMode())

    if(this.props.screenProps.getMode() == "parent") {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.topTopText}>Children</Text>
            <Text style={styles.topText}>{this.state.firstName + " " + this.state.lastName}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image style={styles.welcomeImage} resizeMode="contain" source={{uri: this.state.image}}/>
          </View>
          <View style={styles.buttons}>
            <Button
              onPress={this.prev}
              title="Previous"
              color="black"
            />
            <Button
              onPress={this.next}
              title="Next"
              color="black"
            />
          </View>
        </View>
      )
    }
    else if(this.props.screenProps.getMode() == "child") {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.topText}>{this.state.firstName + " " + this.state.lastName}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image style={styles.welcomeImage} resizeMode="contain" source={{uri: this.state.image}}/>
          </View>

        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.topText}>{this.state.firstName + " " + this.state.lastName}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image style={styles.welcomeImage} resizeMode="contain" source={{uri: this.state.image}}/>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  buttons: {
    flex: 1,
    flexDirection: 'row'
  },
  topTopText: {
    fontSize: 35
  },
  topText: {
    fontWeight: 'bold',
    paddingTop: 30,
    paddingLeft: 15,
    fontSize: 30
  },
  imageContainer: {
    width: 300,
    height: 300,
  },
  welcomeImage: {
    flex:1,
    height: undefined,
    width: undefined,
  }
});
