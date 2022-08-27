import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Style from './../styles/Style';
import {BoxShadow} from 'react-native-shadow';
import FocusableHighlight from './../components/focusable/FocusableHighlight';
import {goBack} from '../Navigation';
import {WToast} from 'react-native-smart-tip';
import {setStorage} from '../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class SetNet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipaddress: '',
      port: '',
      kanbIp: '',
      kanbPort: '',

      ipInputFocus: false,
      portInputFocus: false,
      kanbIpInputFocus: false,
      kanbPortInputFocus: false,
      submitFocus: false,
    };

    this.ipInputRef = React.createRef();
    this.portInputRef = React.createRef();
    this.kanbIpInputRef = React.createRef();
    this.kanbPortInputRef = React.createRef();
  }

  componentDidMount() {
    const {_apiUrl, _ikanb} = global.constants;
    console.log('_ikanb', _ikanb);
    const regex = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[0-5]\d{4}|[1-9]\d{0,3})/g;
    const result = regex.exec(_apiUrl);
    const kanb = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[0-5]\d{4}|[1-9]\d{0,3})/g.exec(
      _ikanb,
    );
    console.log('kanb', kanb);
    this.setState({
      ipaddress: `${result[1]}.${result[2]}.${result[3]}.${result[4]}`,
      port: result[5],
      kanbIp: `${kanb[1]}.${kanb[2]}.${kanb[3]}.${kanb[4]}`,
      kanbPort: kanb[5],
    });
  }

  _scrollToInput(reactNode) {
    this.scroll.scrollTo({x: 0, y: 100, animated: true});
  }

  formComponent() {
    const onSubmit = (event) => {
      if (event.eventKeyAction !== 1) return;
      const {ipaddress, port, kanbIp, kanbPort} = this.state;
      if (!ipaddress.trim() || !port.trim()) {
        WToast.show({
          data: 'IP地址、端口不能为空',
          position: WToast.position.CENTER,
        });
        return;
      }
      global.constants._apiUrl = `http://${ipaddress}:${port}/idcloud`;
      global.constants._ikanb = `http://${kanbIp}:${kanbPort}`;
      setStorage('_apiUrl', global.constants._apiUrl);
      setStorage('_ikanb', global.constants._ikanb);
      goBack();
    };
    return (
      <>
        <View style={[styles.textInputContainer]}>
          <FocusableHighlight
            nativeID={'ip-input'}
            onPress={() => {}}
            onFocus={() => {
              if (this.ipInputRef.current) {
                this.ipInputRef.current.focus();
              }
            }}>
            <BoxShadow
              setting={{
                width: Style.px(444),
                height: Style.px(64),
                color: '#83d5ff',
                border:
                  this.state.ipInputFocus && styles.textInputContainerFocused
                    ? Style.px(30)
                    : 0,
                radius: Style.px(6),
                opacity:
                  this.state.ipInputFocus && styles.textInputContainerFocused
                    ? 0.2
                    : 0.01,
                x: Style.px(-15),
                y: 0,
                style: {...styles.InputWrap},
              }}>
              <Text style={styles.inputlabel}>{'ip地址'}</Text>
              <TextInput
                ref={this.ipInputRef}
                onChangeText={(text) => {
                  this.setState({ipaddress: text});
                }}
                onFocus={() => {
                  this.setState({ipInputFocus: true});
                  this.scroll.scrollTo({x: 0, y: 0, animated: true});
                }}
                onBlur={() => {
                  this.setState({ipInputFocus: false});
                }}
                value={this.state.ipaddress}
                placeholder="请输入IP地址"
                placeholderTextColor={'#80b1f1'}
                clearButtonMode={'always'}
                autoCorrect={false}
                autoFocus={true}
                style={styles.textInput}
              />
            </BoxShadow>
          </FocusableHighlight>
        </View>

        <View style={[styles.textInputContainer]}>
          <FocusableHighlight
            nativeID={'port-input'}
            onPress={() => {}}
            onFocus={() => {
              if (this.portInputRef.current) {
                this.portInputRef.current.focus();
              }
            }}>
            <BoxShadow
              setting={{
                width: Style.px(444),
                height: Style.px(64),
                color: '#83d5ff',
                border:
                  this.state.portInputFocus && styles.textInputContainerFocused
                    ? Style.px(30)
                    : 0,
                radius: Style.px(6),
                opacity:
                  this.state.portInputFocus && styles.textInputContainerFocused
                    ? 0.2
                    : 0.01,
                x: Style.px(-15),
                y: 0,
                style: {...styles.InputWrap},
              }}>
              <Text style={styles.inputlabel}>{'端口'}</Text>
              <TextInput
                ref={this.portInputRef}
                onChangeText={(text) => {
                  this.setState({port: text}, () => {
                    console.log('端口', this.state.port);
                  });
                }}
                onFocus={() => {
                  this.setState({portInputFocus: true});
                  this.scroll.scrollTo({x: 0, y: 0, animated: true});
                }}
                onBlur={() => {
                  this.setState({portInputFocus: false});
                }}
                value={this.state.port}
                placeholder="请输入端口号"
                placeholderTextColor={'#80b1f1'}
                clearButtonMode={'always'}
                autoCorrect={false}
                autoFocus={false}
                style={styles.textInput}
              />
            </BoxShadow>
          </FocusableHighlight>
        </View>

        <View style={[styles.textInputContainer]}>
          <FocusableHighlight
            nativeID={'kanb-ip-input'}
            onPress={() => {}}
            onFocus={() => {
              if (this.kanbIpInputRef.current) {
                this.kanbIpInputRef.current.focus();
              }
            }}>
            <BoxShadow
              setting={{
                width: Style.px(444),
                height: Style.px(64),
                color: '#83d5ff',
                border:
                  this.state.kanbIpInputFocus &&
                  styles.textInputContainerFocused
                    ? Style.px(30)
                    : 0,
                radius: Style.px(6),
                opacity:
                  this.state.kanbIpInputFocus &&
                  styles.textInputContainerFocused
                    ? 0.2
                    : 0.01,
                x: Style.px(-15),
                y: 0,
                style: {...styles.InputWrap},
              }}>
              <Text style={styles.inputlabel}>{'看板IP'}</Text>
              <TextInput
                ref={this.kanbIpInputRef}
                onChangeText={(text) => {
                  this.setState({kanbIp: text});
                }}
                onFocus={() => {
                  this.setState({kanbIpInputFocus: true});
                  this.scroll.scrollTo({x: 0, y: 100, animated: true});
                }}
                onBlur={() => {
                  this.setState({kanbIpInputFocus: false});
                }}
                value={this.state.kanbIp}
                placeholder="请输入看板IP"
                placeholderTextColor={'#80b1f1'}
                clearButtonMode={'always'}
                autoCorrect={false}
                autoFocus={false}
                style={styles.textInput}
              />
            </BoxShadow>
          </FocusableHighlight>
        </View>

        <View style={[styles.textInputContainer]}>
          <FocusableHighlight
            nativeID={'kanb-port-input'}
            onPress={() => {}}
            onFocus={() => {
              if (this.kanbPortInputRef.current) {
                this.kanbPortInputRef.current.focus();
              }
            }}>
            <BoxShadow
              setting={{
                width: Style.px(444),
                height: Style.px(64),
                color: '#83d5ff',
                border:
                  this.state.kanbPortInputFocus &&
                  styles.textInputContainerFocused
                    ? Style.px(30)
                    : 0,
                radius: Style.px(6),
                opacity:
                  this.state.kanbPortInputFocus &&
                  styles.textInputContainerFocused
                    ? 0.2
                    : 0.01,
                x: Style.px(-15),
                y: 0,
                style: {...styles.InputWrap},
              }}>
              <Text style={styles.inputlabel}>{'看板端口'}</Text>
              <TextInput
                ref={this.kanbPortInputRef}
                onChangeText={(text) => {
                  this.setState({kanbPort: text});
                }}
                onFocus={() => {
                  this.setState({kanbPortInputFocus: true});
                  this.scroll.scrollTo({x: 0, y: 140, animated: true});
                }}
                onBlur={() => {
                  this.setState({kanbPortInputFocus: false});
                }}
                value={this.state.kanbPort}
                placeholder="请输入看板端口"
                placeholderTextColor={'#80b1f1'}
                clearButtonMode={'always'}
                autoCorrect={false}
                autoFocus={false}
                style={styles.textInput}
              />
            </BoxShadow>
          </FocusableHighlight>
        </View>

        <FocusableHighlight
          nativeID={'submit-button'}
          onPress={onSubmit}
          onBlur={() => {
            this.setState({submitFocus: false});
          }}
          onFocus={() => {
            this.setState({submitFocus: true});
          }}>
          <BoxShadow
            setting={{
              width: Style.px(445),
              height: Style.px(62),
              color: '#83d5ff',
              border: this.state.submitFocus ? Style.px(30) : 0,
              radius: Style.px(6),
              opacity: this.state.submitFocus ? 0.2 : 0.01,
              x: Style.px(-15),
              y: 0,
              style: {...styles.button},
            }}>
            <Text style={{color: '#fff', fontSize: Style.px(24)}}>
              {'确定'}
            </Text>
          </BoxShadow>
        </FocusableHighlight>
      </>
    );
  }

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={styles.ScrollView}
        innerRef={(ref) => {
          this.scroll = ref;
        }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <FocusableHighlight
              nativeID={'back-button'}
              onPress={(event) => {
                if (event.eventKeyAction === 1) {
                  goBack();
                }
              }}
              onBlur={() => {
                this.setState({backFocus: false});
              }}
              onFocus={() => {
                this.setState({backFocus: true});
              }}>
              <BoxShadow
                setting={{
                  width: Style.px(80),
                  height: Style.px(30),
                  color: '#83d5ff',
                  border: this.state.backFocus ? Style.px(30) : 0,
                  radius: Style.px(10),
                  opacity: this.state.backFocus ? 0.2 : 0.01,
                  x: Style.px(0),
                  y: 0,
                  style: {
                    marginLeft: Style.px(100),
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                }}>
                <Text style={{fontSize: Style.px(24), color: '#80b1f1'}}>
                  {'<'}
                </Text>
                <Text style={styles.back}>{'返回'}</Text>
              </BoxShadow>
            </FocusableHighlight>
          </View>
          <View style={styles.mainContainer}>{this.formComponent()}</View>
        </View>
        <View style={{height: 180}}></View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#04132f',
    width: Style.px(1920),
    height: Style.px(1080),
  },
  ScrollView: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
    backgroundColor: '#04132f',
    // paddingTop: Style.px(300),
  },
  header: {
    height: Style.px(100),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#02437f',
    borderBottomWidth: Style.px(1),
  },
  back: {
    fontSize: Style.px(24),
    marginLeft: Style.px(14),
    color: '#80b1f1',
  },
  mainContainer: {
    flex: 1,
    paddingLeft: Style.px(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    position: 'relative',
    width: Style.px(444),
    marginBottom: Style.px(30),
    backgroundColor: 'transparent',
  },
  textInputContainerFocused: {
    borderColor: '#83d5ff',
    borderWidth: Style.px(1),
  },
  InputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputlabel: {
    color: '#fff',
    width: Style.px(120),
    textAlign: 'right',
  },
  textInput: {
    height: Style.px(64),
    lineHeight: Style.px(40),
    fontSize: Style.px(20),
    color: '#fff',
    paddingTop: Style.px(10),
    paddingBottom: Style.px(10),
    marginLeft: Style.px(15),
    backgroundColor: '#062c64',
    borderRadius: Style.px(6),
    borderWidth: Style.px(1),
    borderColor: '#02437f',
    flex: 1,
    alignItems: 'center',
  },
  button: {
    marginTop: Style.px(50),
    alignItems: 'center',
    justifyContent: 'center',
    width: Style.px(444),
    height: Style.px(60),
    backgroundColor: '#56a0ff',
    borderRadius: Style.px(5),
  },
});
