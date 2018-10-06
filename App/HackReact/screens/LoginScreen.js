import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TextInput, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Buffer} from 'buffer';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.createParent = this.createParent.bind(this);
    this.createDoctor = this.createDoctor.bind(this);
    this.signUp = this.signUp.bind(this);
    this.state = {firstName: "", lastName: "", username: "", password: "", loggingIn: true};
    this.apiUrl = "https://ancient-chipmunk-75.localtunnel.me/api/";
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
  logIn() {
    console.log(this.state);
    this.getData("login?user=" + this.state.username + "&pass=" + this.state.password).then((responseJson) => {
      console.log(responseJson);
      if(responseJson.status == 'Ok') {
        this.props.login(responseJson.id, responseJson.mode)
      }
    });
  }
  signUp() {
    this.getData("signup?firstName=" + this.state.firstName + "&lastName=" + this.state.lastName + "&user=" + this.state.username + "&pass=" + this.state.password).then((responseJson) => {
      this.setState({loggingIn: !this.state.loggingIn});

    });
  }
  createParent() {
    this.setState({loggingIn: !this.state.loggingIn, type: "parent"});
  }
  createDoctor() {
    this.setState({loggingIn: !this.state.loggingIn, type: "doctor"});
  }
  render() {
    if(this.state.loggingIn) {
      return (
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.welcomeImage}
          />
          <View style={styles.topTextContainer}>
            <Text style={styles.topText}>Login</Text>
          </View>
          <View style={styles.inputText}>
            <Text style={{fontWeight: 'bold', fontSize:20}}>Username:</Text>
            <TextInput
              style={{fontSize: 20, width: 150, height: 35, bottom: 2,paddingLeft: 10, marginLeft: 16, backgroundColor: "#f2f2f2", borderRadius:10}}
              placeholder="Username"
              onChangeText={(username) => this.setState({username: username})}
              value={this.state.username}
            />
          </View>
          <View style={styles.inputText2}>
            <Text style={{fontWeight: 'bold', fontSize:20}}>Password:</Text>
            <TextInput
              style={{fontSize: 20, width: 150, height: 35, bottom: 2,paddingLeft: 10, marginLeft: 21, backgroundColor: "#f2f2f2", borderRadius:10}}
              placeholder="Password"
              onChangeText={(password) => this.setState({password: password})}
              value={this.state.password}
              secureTextEntry={true}
            />
          </View>
          <View style={{bottom: 100, width: 100, backgroundColor: "#79D1C3", marginLeft: 50, borderRadius: 15, marginRight: 50}}>
            <Button
              onPress={this.logIn}
              title="Log in"
              color="black"
            />
          </View>
          <View style={{bottom: 90, width: 200, marginLeft: 50, borderRadius: 15, marginRight: 50}}>
            <Button
              style={{textDecorationLine: 'underline'}}
              onPress={this.createParent}
              title="Create Parent Account"
              color="gray"
            />
          </View>
          <View style={{bottom: 90, width: 250, marginLeft: 50, borderRadius: 15, marginRight: 50}}>
            <Button
              style={{textDecorationLine: 'underline'}}
              onPress={this.createDoctor}
              title="Create Doctor Account"
              color="gray"
            />
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.welcomeImage}
          />
          <View style={styles.topTextContainer}>
            <Text style={styles.topText}>Create Account</Text>
          </View>
          <View style={styles.inputText3}>
            <Text style={{fontWeight: 'bold', fontSize:20}}>First Name:</Text>
            <TextInput
              style={{fontSize: 20, width: 150, height: 35, bottom: 2,paddingLeft: 10, marginLeft: 14, backgroundColor: "#f2f2f2", borderRadius:10}}
              placeholder="First Name"
              onChangeText={(firstName) => this.setState({firstName: firstName})}
              value={this.state.firstName}
            />
          </View>
          <View style={styles.inputText4}>
            <Text style={{fontWeight: 'bold', fontSize:20}}>Last Name:</Text>
            <TextInput
              style={{fontSize: 20, width: 150, height: 35, bottom: 2,paddingLeft: 10, marginLeft: 14, backgroundColor: "#f2f2f2", borderRadius:10}}
              placeholder="Last Name"
              onChangeText={(lastName) => this.setState({lastName: lastName})}
              value={this.state.lastName}
              secureTextEntry={false}
            />
          </View>
          <View style={styles.inputText5}>
            <Text style={{fontWeight: 'bold', fontSize:20}}>Username:</Text>
            <TextInput
              style={{fontSize: 20, width: 150, height: 35, bottom: 2,paddingLeft: 10, marginLeft: 16, backgroundColor: "#f2f2f2", borderRadius:10}}
              placeholder="Username"
              onChangeText={(username) => this.setState({username: username})}
              value={this.state.username}
            />
          </View>
          <View style={styles.inputText6}>
            <Text style={{fontWeight: 'bold', fontSize:20}}>Password:</Text>
            <TextInput
              style={{fontSize: 20, width: 150, height: 35, bottom: 2,paddingLeft: 10, marginLeft: 21, backgroundColor: "#f2f2f2", borderRadius:10}}
              placeholder="Password"
              onChangeText={(password) => this.setState({password: password})}
              value={this.state.password}
              secureTextEntry={true}
            />
          </View>
          <View style={{bottom: 100, width: 150, backgroundColor: "#79D1C3", marginLeft: 50, borderRadius: 15, marginRight: 50}}>
            <Button
              onPress={this.signUp}
              title="Create Account"
              color="black"
            />
          </View>
          <View style={{bottom: 90, width: 200, marginLeft: 50, borderRadius: 15, marginRight: 50}}>
            <Button
              style={{textDecorationLine: 'underline'}}
              onPress={this.createParent}
              title="Log in"
              color="gray"
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  topTextContainer: {
    bottom: 20,
    alignItems: 'center'
  },
  loginButton: {

  },
  inputText: {
    flex: 1,
    flexDirection: 'row',
    top: 30,
    paddingLeft: 0
  },
  inputText2: {
    flex: 1,
    flexDirection: 'row',
    bottom: 50,
    paddingLeft: 0
  },
  inputText3: {
    flex: 1,
    flexDirection: 'row',
    bottom: 0,
    paddingLeft: 0
  },
  inputText4: {
    flex: 1,
    flexDirection: 'row',
    bottom: 28,
    paddingLeft: 0
  },
  inputText5: {
    flex: 1,
    flexDirection: 'row',
    bottom: 55,
    paddingLeft: 0
  },
  inputText6: {
    flex: 1,
    flexDirection: 'row',
    bottom: 80,
    paddingLeft: 0
  },
  topText: {
    fontSize: 35
  },
  imageContainer: {
    width: 300,
    height: 300,
  },
  welcomeImage: {
    width: 300,
    height: 160,
    marginLeft:0,
    bottom: 20
  }
});
