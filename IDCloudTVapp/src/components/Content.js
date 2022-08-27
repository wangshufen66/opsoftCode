import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Style from '../styles/Style';
import {AppContext} from '../AppProvider';
import Home from '../views/Home';
import Login from '../views/login';
import Bigscreen from '../views/bigscreen';
import SetNet from '../views/setnet';
// import ComponentsDemo from './demos/ComponentsDemo';
// import EventsDemo from './demos/EventsDemo';
// import FocusDemo from './demos/FocusDemo';
// import ScrollDemo from './demos/ScrollDemo';
// import InputDemo from './demos/InputDemo';
// import VideoDemo from './demos/VideoDemo';

const Stack = createStackNavigator();

const Content = () => {
  const [appContext, setAppContext] = useContext(AppContext);

  const [page, setPage] = useState('login');

  return (
    <View
      style={[
        styles.navigator,
        !appContext.menuVisible && styles.navigatorFullscreen,
      ]}>
      <Stack.Navigator
        initialRouteName={page}
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animationEnabled: true,
          unmountInactiveScreen: true,
          detachPreviousScreen: true,
        }}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="bigscreen" component={Bigscreen} />
        <Stack.Screen name="setnet" component={SetNet} />
      </Stack.Navigator>
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'row',
  },
  navigator: {
    width: Style.px(1920),
    height: Style.px(1080),
  },
  navigatorFullscreen: {
    width: Style.px(1920),
  },
});
