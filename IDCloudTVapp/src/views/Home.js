import React, {useState, Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import Style from '../styles/Style';
import {BoxShadow} from 'react-native-shadow';
import FocusableHighlight from './../components/focusable/FocusableHighlight';
import {navigate} from '../Navigation';
import {getToken, getStorage, removeToken} from './../utils/index';
import request from './../utils/request';
import moment from 'moment';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backFocus: false,
      mainImageFocus: false,
      imageList: [],
      orgId: 0,
      activeItem: undefined,
      activeIndex: 0,
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    getStorage('orgId').then((orgid) => {
      this.setState({orgId: orgid});
      if (!orgid) {
        this.loginOut();
        return;
      }
      this.getDashboards();
    });
  }

  loginOut() {
    removeStorage('user-login-info');
    removeToken();
    navigate('login');
  }

  openBigScreen() {
    getToken().then((token) => {
      navigate('bigscreen', {
        hash: this.state.activeItem.hash,
        orgId: this.state.orgId,
        token,
      });
    });

    console.log('页面参数', this.state.activeItem.hash);
  }

  getDashboards() {
    const {orgId} = this.state;
    const url = `/dashboard/user/${orgId}/dashboards`;
    request.get(url, {params: {project: '全部大屏'}}).then((res) => {
      const items = res.items || [];
      const imageItems = items.map((m, index) => {
        return {
          hash: m.hash,
          imgUrl: m.imgUrl,
          title: m.config.title,
          date: moment(m.config.timestamp).format('YYYY-MM-DD HH:mm'),
          focus: index == 0,
        };
      });
      this.state.activeItem = imageItems[0];
      this.setState({imageList: imageItems || []});
    });
  }

  leftComponent() {
    const _this = this;
    const items = this.state.imageList.map((m, index) => {
      return (
        <FocusableHighlight
          key={m.hash}
          nativeID={`left-image-${index}`}
          onPress={(event) => {
            if (event.eventKeyAction === 1) {
              // 改变右侧显示图片
            }
          }}
          onBlur={() => {
            const items = _this.state.imageList;
            items[index].focus = false;
            _this.setState({imageList: items});
          }}
          onFocus={() => {
            const items = _this.state.imageList;
            items[index].focus = true;
            _this.setState({imageList: items});
            _this.setState({activeItem: items[index]});
            _this.setState({activeIndex: index});
          }}>
          <BoxShadow
            setting={{
              width: Style.px(340),
              height: Style.px(252),
              color: '#83d5ff',
              border: _this.state.imageList[index].focus ? Style.px(10) : 0,
              radius: Style.px(4),
              opacity: _this.state.imageList[index].focus ? 0.2 : 0.01,
              x: Style.px(0),
              y: 0,
              style: {
                marginBottom: Style.px(33),
                height: Style.px(250),
                alignItems: 'center',
              },
            }}>
            <Image
              source={{url: _this.state.imageList[index].imgUrl}}
              style={styles.leftImage}></Image>
            <View style={styles.leftImageDes}>
              <Text style={{color: '#fff', fontSize: Style.px(18)}}>
                {_this.state.imageList[index].title}
              </Text>
              <Text
                style={{
                  fontSize: Style.px(14),
                  opacity: 0.7,
                  color: '#fff',
                  marginTop: Style.px(8),
                }}>
                {_this.state.imageList[index].date}
              </Text>
            </View>
          </BoxShadow>
        </FocusableHighlight>
      );
    });
    return (
      <View style={styles.leftWrap}>
        <ScrollView
          // ref={rowsRef}
          style={styles.left}
          nativeID={'left-rows'}
          showsVerticalScrollIndicator={false}>
          {items}
        </ScrollView>
      </View>
    );
  }

  conentComponent() {
    return (
      <View style={styles.content}>
        <FocusableHighlight
          nativeID={'main-content'}
          // nextFocusDown={bottomLeftHandle}
          onPress={(event) => {
            if (event.eventKeyAction === 1) {
              // this.loginOut();
              this.openBigScreen();
            }
          }}
          onBlur={() => {
            this.setState({mainImageFocus: false});
          }}
          onFocus={() => {
            this.setState({mainImageFocus: true});
          }}>
          <BoxShadow
            setting={{
              width: Style.px(1350),
              height: Style.px(760),
              color: '#83d5ff',
              border: this.state.mainImageFocus ? Style.px(10) : 0,
              radius: Style.px(1),
              opacity: this.state.mainImageFocus ? 0.2 : 0.01,
              x: Style.px(0),
              y: 0,
            }}>
            <Image
              source={{url: this.state.activeItem?.imgUrl}}
              style={styles.contentImage}></Image>
          </BoxShadow>
        </FocusableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <FocusableHighlight
            nativeID={'back-button'}
            onPress={(event) => {
              if (event.eventKeyAction === 1) {
                this.loginOut();
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
                border: this.state.backFocus ? Style.px(20) : 0,
                radius: Style.px(10),
                opacity: this.state.backFocus ? 0.1 : 0.01,
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
        <View style={styles.mainContainer}>
          {this.leftComponent()}
          {this.conentComponent()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#04132f',
    width: Style.px(1920),
    height: Style.px(1080),
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
    flexDirection: 'row',
    paddingLeft: Style.px(100),
    alignItems: 'center',
  },
  content: {
    height: Style.px(760),
    width: Style.px(1350),
    backgroundColor: '#04132f',
  },
  leftWrap: {
    height: Style.px(780),
    width: Style.px(340),
    marginRight: Style.px(70),
  },
  left: {
    height: Style.px(780),
    width: Style.px(340),
    backgroundColor: '#04132f',
    paddingTop: Style.px(20),
    paddingBottom: Style.px(20),
    paddingLeft: Style.px(20),
    paddingRight: Style.px(20),
  },
  leftImage: {
    height: Style.px(168),
    width: Style.px(300),
  },
  leftImageDes: {
    height: Style.px(80),
    width: Style.px(300),
    paddingTop: Style.px(16),
    paddingBottom: Style.px(16),
    paddingLeft: Style.px(24),
    // alignItems: 'center',
    justifyContent: 'center',
  },
  contentImage: {
    height: Style.px(760),
    width: Style.px(1350),
    position: 'absolute',
    zIndex: -10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
