import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  Picker,
  Platform,
  Animated
} from 'react-native';
import Style from './style';


class RNPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      modalVisible: false,
      animatedHeight: new Animated.Value(0)
    };

    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillMount() {
    // ignore the warning of Failed propType for date of DatePickerIOS, will remove after being fixed by official
    console.ignoredYellowBox = [
      'Warning: Failed propType'
      // Other warnings you don't want like 'jsSchedulingOverhead',
    ];
  }

  setModalVisible(visible) {
    const { height, duration } = this.props;

    this.setState({ modalVisible: visible });

    // slide animation
    if (visible) {
      Animated.timing(
        this.state.animatedHeight,
        {
          toValue: height,
          duration: duration
        }
      ).start();
    } else {
      this.setState({
        animatedHeight: new Animated.Value(0)
      });
    }
  }

  onStartShouldSetResponder(e) {
    return true;
  }

  onMoveShouldSetResponder(e) {
    return true;
  }

  onPressCancel() {
    this.setModalVisible(false);
  }

  onValueChange(item) {
    this.setState({ selected: item });
  }

  onPressConfirm() {
    this.props.onValueChange(this.state.selected);
    this.setModalVisible(false);
  }

  render() {
    const {
      mode,
      style,
      customStyles,
      disabled,
      showIcon,
      iconSource,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      confirmBtnText
    } = this.props;

    const dateInputStyle = [
      Style.dateInput, customStyles.dateInput,
      disabled && Style.disabled,
      disabled && customStyles.disabled
    ];

    return (
      <TouchableHighlight
        style={[Style.dateTouch, style]}
        underlayColor={'transparent'}
        onPress={() => this.setModalVisible(true)}
      >
        <View style={[Style.dateTouchBody, customStyles.dateTouchBody]}>
          <View style={dateInputStyle}>
            {this.props.renderTitle()}
          </View>
          {showIcon && <Image
            style={[Style.dateIcon, customStyles.dateIcon]}
            source={iconSource}
          />}
          <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {this.setModalVisible(false);}}
          >
            <View
              style={{flex: 1}}
            >
              <TouchableHighlight
                style={Style.datePickerMask}
                activeOpacity={1}
                underlayColor={'#00000077'}
                onPress={this.onPressCancel}
              >
                <TouchableHighlight
                  underlayColor={'#fff'}
                  style={{flex: 1}}
                >
                  <Animated.View
                    style={[Style.datePickerCon, {height: this.state.animatedHeight}, customStyles.datePickerCon]}
                  >
                    <Picker
                      style={[Style.datePicker, customStyles.datePicker]}
                      selectedValue={this.state.selected}
                      onValueChange={item => this.onValueChange(item)}>
                      {this.props.values.map((item, i) => (
                        <Picker.Item key={`pickerItem${i}`}  {...item} />
                      ))}
                    </Picker>
                    <TouchableHighlight
                      underlayColor={'transparent'}
                      onPress={this.onPressCancel}
                      style={[Style.btnText, Style.btnCancel, customStyles.btnCancel]}
                    >
                      <Text
                        style={[Style.btnTextText, Style.btnTextCancel, customStyles.btnTextCancel]}
                      >
                        {cancelBtnText}
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      underlayColor={'transparent'}
                      onPress={this.onPressConfirm}
                      style={[Style.btnText, Style.btnConfirm, customStyles.btnConfirm]}
                    >
                      <Text style={[Style.btnTextText, customStyles.btnTextConfirm]}>{confirmBtnText}</Text>
                    </TouchableHighlight>
                  </Animated.View>
                </TouchableHighlight>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
      </TouchableHighlight>
    );
  }
}

RNPicker.defaultProps = {
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  confirmBtnText: 'Confirm',
  cancelBtnText: 'Cancel',
  customStyles: {},

  // whether or not show the icon
  showIcon: true,
  disabled: false,
  placeholder: '',
  modalOnResponderTerminationRequest: e => true
};

RNPicker.propTypes = {
  height: React.PropTypes.number,
  duration: React.PropTypes.number,
  confirmBtnText: React.PropTypes.string,
  cancelBtnText: React.PropTypes.string,
  customStyles: React.PropTypes.object,
  showIcon: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  modalOnResponderTerminationRequest: React.PropTypes.func,
  renderTitle: React.PropTypes.func,
  values: React.PropTypes.array,
  onValueChange: React.PropTypes.func,
};

export default RNPicker;
