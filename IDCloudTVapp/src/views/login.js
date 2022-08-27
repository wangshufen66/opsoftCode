import React, {Component} from 'react';
import {View, Text, Image, TextInput, StyleSheet} from 'react-native';
import Style from './../styles/Style';
import {BoxShadow} from 'react-native-shadow';
import FocusableHighlight from './../components/focusable/FocusableHighlight';
import {WToast} from 'react-native-smart-tip';
import request from './../utils/request';
import {setToken, setStorage, getStorage} from './../utils/index';
import {navigate} from './../Navigation';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entCode: '',
      userName: '',
      password: '',
      checked: global.constants.intranet,
      checkBoxFocus: false,
      settingFocus: false,
      submitFocus: false,

      codeInputFocus: true,
      userNameInputFocus: false,
      paswdInputFocus: false,
    };
    this.codeInputRef = React.createRef();
    this.userNameInputRef = React.createRef();
    this.paswdInputRef = React.createRef();
  }

  componentDidMount() {
    getStorage('user-login-info').then((userinfo) => {
      if (userinfo) {
        request
          .post('/auth/token', userinfo)
          .then((res) => {
            setToken(res.token);
            setStorage('orgId', res.orgId);
            navigate('home');
            // 用户信息存储
          })
          .catch((err) => {
            WToast.show({data: err, position: WToast.position.CENTER});
          });
      }
    });
  }

  _scrollToInput(reactNode) {
    this.scroll.scrollTo({x: 0, y: 100, animated: true});
  }

  onSetting(event) {
    if (event.eventKeyAction === 1) {
    }
  }

  codeInput() {
    return (
      <View style={[styles.textInputContainer]}>
        <FocusableHighlight
          nativeID={'code-input'}
          onPress={() => {}}
          onFocus={() => {
            if (this.codeInputRef.current) {
              this.codeInputRef.current.focus();
            }
          }}>
          <BoxShadow
            setting={{
              width: Style.px(444),
              height: Style.px(64),
              color: '#83d5ff',
              border:
                this.state.codeInputFocus && styles.textInputContainerFocused
                  ? Style.px(30)
                  : 0,
              radius: Style.px(6),
              opacity:
                this.state.codeInputFocus && styles.textInputContainerFocused
                  ? 0.2
                  : 0.01,
              x: Style.px(-15),
              y: 0,
              style: {...styles.InputWrap},
            }}>
            <Image
              source={require('./../images/build.png')}
              style={styles.inputIcon}
            />
            <TextInput
              ref={this.codeInputRef}
              onChangeText={(text) => {
                this.setState({entCode: text})
              }}
              onFocus={() => {
                this.setState({codeInputFocus: true});
              }}
              onBlur={() => {
                this.setState({codeInputFocus: false});
              }}
              hasTVPrefferedFocus={true}
              placeholder="请输入企业代码"
              placeholderTextColor={'#80b1f1'}
              clearButtonMode={'always'}
              autoCorrect={false}
              autoFocus={true}
              style={styles.textInput}
            />
          </BoxShadow>
        </FocusableHighlight>
      </View>
    );
  }

  userNameInput() {
    return (
      <View style={[styles.textInputContainer]}>
        <FocusableHighlight
          nativeID={'username-input'}
          onPress={() => {}}
          onFocus={() => {
            if (this.userNameInputRef.current) {
              this.userNameInputRef.current.focus();
            }
          }}>
          <BoxShadow
            setting={{
              width: Style.px(444),
              height: Style.px(64),
              color: '#83d5ff',
              border:
                this.state.userNameInputFocus &&
                styles.textInputContainerFocused
                  ? Style.px(30)
                  : 0,
              radius: Style.px(6),
              opacity:
                this.state.userNameInputFocus &&
                styles.textInputContainerFocused
                  ? 0.2
                  : 0.01,
              x: Style.px(-15),
              y: 0,
              style: {...styles.InputWrap},
            }}>
            <Image
              source={require('./../images/user.png')}
              style={styles.inputIcon}
            />
            <TextInput
              ref={this.userNameInputRef}
              onChangeText={(text) => {
                this.setState({userName: text});
              }}
              onFocus={() => {
                this.setState({userNameInputFocus: true});
              }}
              onBlur={() => {
                this.setState({userNameInputFocus: false});
              }}
              placeholder="登录账号"
              placeholderTextColor={'#80b1f1'}
              clearButtonMode={'always'}
              autoCorrect={false}
              autoFocus={false}
              style={styles.textInput}
            />
          </BoxShadow>
        </FocusableHighlight>
      </View>
    );
  }

  paswdInput() {
    return (
      <View style={[styles.textInputContainer]}>
        <FocusableHighlight
          nativeID={'password-input'}
          onPress={() => {}}
          onFocus={(event) => {
            if (this.paswdInputRef.current) {
              this.paswdInputRef.current.focus();
              this._scrollToInput(event.target);
            }
          }}>
          <BoxShadow
            setting={{
              width: Style.px(444),
              height: Style.px(64),
              color: '#83d5ff',
              border:
                this.state.paswdInputFocus && styles.textInputContainerFocused
                  ? Style.px(30)
                  : 0,
              radius: Style.px(6),
              opacity:
                this.state.paswdInputFocus && styles.textInputContainerFocused
                  ? 0.2
                  : 0.01,
              x: Style.px(-15),
              y: 0,
              style: {...styles.InputWrap},
            }}>
            <Image
              source={require('./../images/pass.png')}
              style={styles.inputIcon}
            />
            <TextInput
              ref={this.paswdInputRef}
              onChangeText={(text) => {
                this.setState({password: text});
              }}
              onFocus={() => {
                this.setState({paswdInputFocus: true});
              }}
              onBlur={() => {
                this.setState({paswdInputFocus: false});
              }}
              secureTextEntry={true}
              placeholder="密码"
              placeholderTextColor={'#80b1f1'}
              clearButtonMode={'always'}
              autoCorrect={false}
              autoFocus={false}
              style={styles.textInput}
            />
          </BoxShadow>
        </FocusableHighlight>
      </View>
    );
  }

  render() {
    const onSubmit = (event) => {
      if (event.eventKeyAction === 1) {
        if (!this.state.entCode.trim()) {
          WToast.show({
            data: '企业代码不能为空',
            position: WToast.position.CENTER,
          });
          return;
        } else if (!this.state.userName.trim()) {
          WToast.show({
            data: '用户名不能为空',
            position: WToast.position.CENTER,
          });
          return;
        } else if (!this.state.password.trim()) {
          WToast.show({data: '密码不能为空', position: WToast.position.CENTER});
          return;
        }
        const params = {
          username: `${this.state.userName}$$${this.state.entCode}`,
          password: this.state.password,
        };
        request
          .post('/auth/token', params)
          .then((res) => {
            setToken(res.token);
            setStorage('orgId', res.orgId);
            navigate('home');
            // 用户信息存储
            setStorage('user-login-info', params);
          })
          .catch((err) => {
            WToast.show({data: err, position: WToast.position.CENTER});
          });
      }
    };
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={styles.ScrollView}
        innerRef={(ref) => {
          this.scroll = ref;
        }}>
        <View style={styles.container}>
          <View style={styles.formWrap}>
            <Image
              source={require('./../images/ic_logo.png')}
              style={styles.logo}
            />
            <View style={styles.inputItem}>{this.codeInput()}</View>
            <View style={styles.inputItem}>{this.userNameInput()}</View>
            <View style={styles.inputItem}>{this.paswdInput()}</View>
            <View style={styles.checkContainer}>
              <FocusableHighlight
                nativeID={'check-button'}
                onPress={(event) => {
                  if (event.eventKeyAction === 1) {
                    const checked = !this.state.checked;
                    this.setState({checked: checked});
                    global.constants.intranet = checked;
                  }
                }}
                onBlur={() => {
                  this.setState({checkBoxFocus: false});
                }}
                onFocus={() => {
                  this.setState({checkBoxFocus: true});
                }}
                style={{flexDirection: 'row'}}>
                <BoxShadow
                  setting={{
                    width: Style.px(100),
                    height: Style.px(25),
                    color: '#83d5ff',
                    border: this.state.checkBoxFocus ? Style.px(30) : 0,
                    radius: Style.px(6),
                    opacity: this.state.checkBoxFocus ? 0.2 : 0.01,
                    x: Style.px(-15),
                    y: 0,
                    style: {...styles.checkBoxWrap},
                  }}>
                  <View style={styles.checkBox}>
                    {this.state.checked && (
                      <Text style={{color: '#fff', fontSize: Style.px(16)}}>
                        {'√'}
                      </Text>
                    )}
                  </View>
                  <Text style={{color: '#fff', fontSize: Style.px(18)}}>
                    {'内网登录'}
                  </Text>
                </BoxShadow>
              </FocusableHighlight>
              <FocusableHighlight
                nativeID={'setting-button'}
                onPress={() => {
                  navigate('setnet');
                }}
                onBlur={() => {
                  this.setState({settingFocus: false});
                }}
                onFocus={() => {
                  this.setState({settingFocus: true});
                }}>
                <BoxShadow
                  setting={{
                    width: Style.px(110),
                    height: Style.px(25),
                    color: '#83d5ff',
                    border: this.state.settingFocus ? Style.px(30) : 0,
                    radius: Style.px(6),
                    opacity: this.state.settingFocus ? 0.2 : 0.01,
                    x: Style.px(-15),
                    y: 0,
                    style: {...styles.settingWrap},
                  }}>
                  <Image
                    source={require('./../images/ic_set.png')}
                    style={{
                      width: Style.px(20),
                      height: Style.px(20),
                      marginRight: Style.px(10),
                    }}
                  />
                  <Text style={{color: '#fff', fontSize: Style.px(18)}}>
                    {'网络设置'}
                  </Text>
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
                  {'登录'}
                </Text>
              </BoxShadow>
            </FocusableHighlight>
          </View>
        </View>
        <Image
          source={require('./../images/ic_login_back.png')}
          style={styles.backgroundImage}
        />
        <View style={{height: 60}}></View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  ScrollView: {
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
    // paddingTop: Style.px(300),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    width: Style.px(189),
    height: Style.px(163),
    marginBottom: Style.px(54),
  },
  formWrap: {
    width: Style.px(600),
    height: Style.px(1080),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    zIndex: -10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Style.px(32),
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: Style.px(32),
    marginBottom: Style.px(36),
  },
  checkBoxWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Style.px(235),
  },
  checkBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Style.px(1),
    borderColor: '#fff',
    borderStyle: 'solid',
    width: Style.px(15),
    height: Style.px(15),
    marginRight: Style.px(11),
  },
  settingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Style.px(444),
    height: Style.px(60),
    backgroundColor: '#56a0ff',
    borderRadius: Style.px(5),
  },
  textInputContainer: {
    position: 'relative',
    backgroundColor: '#062c64',
    borderRadius: Style.px(6),
    paddingLeft: Style.px(16),
    paddingRight: Style.px(16),
    borderWidth: Style.px(1),
    borderColor: '#02437f',
    width: Style.px(444),
  },
  textInputContainerFocused: {
    borderColor: '#83d5ff',
    borderWidth: Style.px(1),
  },
  InputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: Style.px(64),
    lineHeight: Style.px(64),
    fontSize: Style.px(20),
    color: '#fff',
    marginLeft: Style.px(15),
    paddingLeft: Style.px(16),
    paddingRight: Style.px(16),
    paddingTop: Style.px(10),
    paddingBottom: Style.px(10),
    borderLeftWidth: Style.px(1),
    borderLeftColor: '#02437f',
    borderStyle: 'solid',
  },
  textInputClearButton: {
    width: Style.px(50),
    height: Style.px(50),
    marginLeft: Style.px(10),
    marginRight: Style.px(10),
    borderRadius: Style.px(5),
    borderWidth: Style.px(5),
    borderColor: 'transparent',
  },
  textInputClearButtonFocused: {
    borderColor: '#61dafb',
  },
  inputIcon: {
    width: Style.px(30),
    height: Style.px(30),
  },
  dummyFocusable: {
    width: 0,
    height: 0,
  },
});
