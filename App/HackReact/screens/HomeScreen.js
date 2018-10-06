import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Buffer} from 'buffer';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    this.state = {firstName: "", image: ""};
    this.apiUrl = "https://average-cow-84.localtunnel.me/api/";
    this.getName(6);

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

      this.setState(previousState => {
        console.log(responseJson);
        this.getQR(id);
        return { firstName: responseJson.rows[0].firstName + " " + responseJson.rows[0].lastName };
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
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.topText}>{this.state.firstName}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.welcomeImage} resizeMode="contain" source={{uri: this.state.image}}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  topText: {
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
