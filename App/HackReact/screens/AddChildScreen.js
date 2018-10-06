import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TextInput, Button, Linking, TouchableOpacity, Alert } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import {Buffer} from 'buffer';
import { Camera, Permissions, FileSystem } from 'expo';
import {CameraExample} from '../screens/CameraExample';

export default class AddChildScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Child',
  };
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.done = this.done.bind(this);
    this.state = {array: [], codeScanned: false, id: "",     hasCameraPermission: null,
    type: Camera.Constants.Type.back, firstName: "", lastName: "", username: "", password: "", loggingIn: false, accountAdded: false};
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
        this.props.login()
      }
    });
  }
  signUp() {
    this.getData("signupChild?parentId=" + this.props.screenProps.id + "&firstName=" + this.state.firstName + "&lastName=" + this.state.lastName + "&user=" + this.state.username + "&pass=" + this.state.password).then((responseJson) => {
      console.log(responseJson);
      this.setState({id: responseJson.id, accountAdded: true});
      this.props.screenProps.childAdded(true);
    });
  }
  done() {
    this.setState({accountAdded: false});
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  snap = async () => {
  if (this.camera) {
    let photo = await this.camera.takePictureAsync(options={quality: .2, base64: true});
    return fetch(this.apiUrl + 'readQR', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: photo.base64
      })
    })
      .then((response) => response.json()).then((responseJson) => {
        this.getInfo();

      });
    console.log(photo);
  }
};
getInfo() {
  this.getData("get_patient_by_id?id=" + this.props.screenProps.id).then((responseJson) => {
    arr = []
    firstName = "";
    lastName = "";
    console.log("TEST")
    console.log(responseJson.rows[0])
    for(var key in responseJson.rows[0]) {
      if(key == "firstName") {
        firstName = responseJson.rows[0][key];
      }
      if(key == "lastName") {
        lastName = responseJson.rows[0][key];
      }
      arr.push(responseJson.rows[0][key])
      console.log(responseJson.rows[0][key])
    }
    if(firstName != "" && lastName != "") {
      Alert.alert(
        'Patient found',
        firstName + " " + lastName + "'s info was found and saved",
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    }
    else {
      Alert.alert(
        'Patient found',
        "A patient's info was found and saved",
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    }
    this.setState({codeScanned: true, array: arr})
});
}
getInfo2() {
    arr = [1, 2, 3, 4, 5]


}
  render() {
    console.log(this.props.screenProps.getMode())
    if(this.props.screenProps.getMode() == "doctor") {

      const { hasCameraPermission } = this.state;
       if (hasCameraPermission === null) {
         return <View />;
       } else if (hasCameraPermission === false) {
         return <Text>No access to camera</Text>;
       } else {
         return (
           <View style={{ flex: 1 }}>
             <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
               <View
                 style={{
                   flex: 1,
                   backgroundColor: 'transparent',
                   flexDirection: 'row',
                 }}>
                 <TouchableOpacity
                   style={{
                     flex: 0.1,
                     alignSelf: 'flex-end',
                     alignItems: 'center',
                   }}
                   onPress={() => {
                     this.setState({
                       type: this.state.type === Camera.Constants.Type.back
                         ? Camera.Constants.Type.front
                         : Camera.Constants.Type.back,
                     });
                   }}>
                   <View style={{left: 165, bottom:20, width: 100, alignItems: 'center'}}>
                   <Button
                     style={{fontSize: 20, textDecorationLine: 'underline'}}
                     onPress={this.snap}
                     title="Snap"
                     color="gray"
                   />
                   </View>
                 </TouchableOpacity>
               </View>
             </Camera>
           </View>
         );
       }
     }
    else {
      if(this.state.accountAdded) {
        return (
          <View style={styles.container}>
            <View style={styles.topTextContainer}>
              <Text style={styles.topText}>Child Account Created</Text>
            </View>
            <View style={styles.inputText7}>
              <Text style={{fontWeight: 'bold', fontSize:20}}>Go to this url to fill in your childs medical info.</Text>

              <Text style={{fontWeight: 'bold', fontSize:20}}>Enter {this.state.id} in the Child ID box.</Text>


              <Text style={{fontWeight: 'bold', color: 'blue', fontSize:20, paddingTop: 20}} onPress={() => Linking.openURL('http://med-me.org')}>https://med-me.org</Text>

            </View>
            <View style={{bottom: 100, width: 150, backgroundColor: "#79D1C3", marginLeft: 50, borderRadius: 15, marginRight: 50}}>
              <Button
                onPress={this.done}
                title="Done"
                color="black"
              />
            </View>

          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            <View style={styles.topTextContainer}>
              <Text style={styles.topText}>Create Child Account</Text>
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

          </View>
        );
      }
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
    bottom: 80,
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
  inputText7: {
    flex: 1,
    bottom: 0,
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
