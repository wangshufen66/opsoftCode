import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './Navigation';
import AppProvider from './AppProvider';
import Style from './styles/Style';
import Content from './components/Content';
// Enable screens
import {enableScreens} from 'react-native-screens';
import {getStorage, setStorage} from './utils/index';
import './utils/config';

export default class App extends Component {
  componentDidMount() {
    // 读取配置
    Promise.all(
      getStorage('_apiUrl'),
      getStorage('_ikanb'),
      getStorage('intranet'),
    ).then((res) => {
      res[0] && (global.constants._apiUrl = res[0]);
      res[1] && (global.constants._ikanb = res[1]);
      res[2] && (global.constants.intranet = res[2]);
    });
    enableScreens();
  }

  render() {
    return (
      <AppProvider>
        <NavigationContainer ref={navigationRef}>
          <View style={styles.app}>
            <Content />
          </View>
        </NavigationContainer>
      </AppProvider>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'row',
  },
});
