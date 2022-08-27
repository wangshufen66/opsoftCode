import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Style from '../styles/Style';

export default class Bigscreen extends Component {
  constructor(props) {
    super(props);
    const {hash, orgId, token} = props.route.params;
    this.state = {
      url: `${
        !global.constants.intranet ? global.constants.ikanb : global.constants._ikanb
      }/#/login?auth=true&token=${token}&userId=${orgId}&hash=${hash}&goto=/preview/`,
    };
  }

  render() {
    return (
      <WebView
        source={{
          uri: this.state.url,
        }}
        style={styles.style}
      />
    );
  }
}

const styles = StyleSheet.create({
  style: {
    width: Style.px(1920),
    height: Style.px(1080),
  },
});
