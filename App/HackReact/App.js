import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.getMode = this.getMode.bind(this);
    this.login = this.login.bind(this);
    this.childAdded = this.childAdded.bind(this);
  }
  state = {
    isLoadingComplete: false,
    childCreated: false,
    loggedIn: false,
    id: "35",
    mode: "doctor"
  };

  login(id, mode) {
      this.setState({
        id: id,
        mode: mode,
        loggedIn: true
      })
  }
  childAdded(value) {
    this.setState({
      childCreated: value
    });
  }
  getMode() {
    return this.state.mode;
  }
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      if(this.state.loggedIn == false) {
        return (
          <View style={styles.container}>
            <LoginScreen login={this.login}  getMode={this.getMode} screenProps={this.state.id} />
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator login={this.login} childAdded={this.childAdded} getMode={this.getMode} screenProps={{id: this.state.id, getMode: this.getMode, childAdded: this.childAdded}}/>
          </View>
        );
      }
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
