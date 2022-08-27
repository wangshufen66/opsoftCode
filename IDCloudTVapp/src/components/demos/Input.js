import React, {useState, useEffect, useRef} from 'react';
import {View, Image, TextInput, StyleSheet} from 'react-native';
import Style from '../../styles/Style';
// import clearImageSource from '../../assets/clear.png';
import FocusableHighlight from '../focusable/FocusableHighlight';
import {BoxShadow} from 'react-native-shadow';

const Input = (props) => {
  const inputTextRef = useRef(null);

  const [textInputFocused, setTextInputFocused] = useState(false);
  const [textInputVal, setTextInputVal] = useState('');

  let autocompleteTimer = null;

  useEffect(() => {
    if (inputTextRef.current) {
      inputTextRef.current.focus();
    }
    // Clean up
    return () => {
      clearTimeout(autocompleteTimer);
    };
  }, [autocompleteTimer]);

  function onKeyPress(event) {
    console.log('onKeyPress', event);
  }

  const input_id = `${props.prop}_input`;
  return (
   
  );
};

export default Input;

const styles = StyleSheet.create({
  
});
