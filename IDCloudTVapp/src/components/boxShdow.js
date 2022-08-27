import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {BoxShadow} from 'react-native-shadow';

const defaultOption = {
  color: '#EBEBEB',
  border: 3,
  radius: 5,
  opacity: 0.5,
  x: 3,
  y: 4,
};

class ShadowBoxView extends Component {
  static propTypes = {
    style: PropTypes.object,
    color: PropTypes.string,
    shadowOption: PropTypes.object,
  };

  static defaultProps = {
    shadowOption: defaultOption,
  };

  constructor(props) {
    super(props);
    this.state = {
      contentHeight: 0,
      contentWidth: 0,
      showShadow: false,
    };
  }

  componentDidMount() {}

  render() {
    const {color, style, shadowOption} = this.props;

    if (!this.state.showShadow) {
      return (
        <View
          style={style}
          onLayout={(e) => {
            const layout = e.nativeEvent.layout;
            // console.log(layout)
            this.setState({
              contentWidth: layout.width,
              contentHeight: layout.height,
              showShadow: true,
            });
          }}>
          {this.props.children}
        </View>
      );
    }

    return (
      <BoxShadow
        setting={{
          height: this.state.contentHeight,
          width: this.state.contentWidth,
          color: color,
          ...defaultOption,
          ...shadowOption,
        }}>
        <View style={style}>{this.props.children}</View>
      </BoxShadow>
    );
  }
}
export default ShadowBoxView;
