"use strict";
import React, { Component, useContext } from "react";
import {
  PanResponder,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { findDOMNode } from "react-dom";
import { keyMap_Both, keyMap_1, keyMap_2, keyMap_None } from "../global/keyMap";

import GameContext from "../context/GameContext";

const getElement = (component) => {
  try {
    return findDOMNode(component);
  } catch (e) {
    return component;
  }
};
export const swipeDirections = {
  SWIPE_UP: "SWIPE_UP",
  SWIPE_DOWN: "SWIPE_DOWN",
  SWIPE_LEFT: "SWIPE_LEFT",
  SWIPE_RIGHT: "SWIPE_RIGHT",
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

function isValidSwipe(
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold
) {
  return (
    Math.abs(velocity) > velocityThreshold &&
    Math.abs(directionalOffset) < directionalOffsetThreshold
  );
}

const freezeBody = (e) => {
  e.preventDefault();
};

class GestureView extends Component {

  constructor(props, context) {
    super(props, context);
    this._keyMap = props.keyMap;
    this.gameMode = props.gameMode;
    this.socket = props.socket;
    this.role = props.role;

    
    if (this.role == 'server') {
      this.align = 'left';
      if (this._keyMap == keyMap_None)
        this.align = 'right';
    } else if (this.role == 'client') {
      this.align = 'right';
      if (this._keyMap == keyMap_None)
        this.align = 'left';

    }


    this.socket.on('MOVE_PERSON_APPROVED', this.handleMoving);

    this.swipeConfig = Object.assign(swipeConfig, props.config);
    this._panResponder = PanResponder.create({

      onPanResponderStart: () => {
        this.props.onResponderGrant();
      },
      onStartShouldSetPanResponder: this._handleShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("keyup", this.onKeyUp, false);
  }
  componentWillUnmount() {
    if (this.view) {
      this.view.removeEventListener("touchstart", this.touchStart, false);
      this.view.removeEventListener("touchmove", freezeBody, false);
    }
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.swipeConfig = Object.assign(swipeConfig, props.config);

  }

  onKeyDown = (e) => {
    if (this._keyMap) {
      const direction = this._keyMap[e.code];
      if (direction) {
        this.props.onResponderGrant();
      }
    }
  };

  handleMoving = (data) => {

    if (this.role == data.role && this.align == data.align) {

      this.props.onResponderGrant();
      this.props.onSwipe(data.direction);

    }
    // this.socket.off('MOVE_PERSON_APPROVED', handleMoving);
  }


  onKeyUp = (e) => {
    if (this.gameMode == 2) {

      if (keyMap_Both[e.code]) { // if direction key ?
        if (this.role == 'server') {
          const direction = this._keyMap[e.code];

          if (direction) {
            this.props.onSwipe(direction);
            this.socket.emit('message', JSON.stringify({
              cmd: 'MOVE_PERSON',
              direction: direction,
              role: this.role,
              keyMap: this._keyMap,
              align: this.align
            }));
          }

        } else if (this.role = 'client') {
          const direction = this._keyMap[e.code];
          
          if (direction) {
            this.props.onSwipe(direction);
            this.socket.emit('message', JSON.stringify({
              cmd: 'MOVE_PERSON',
              direction: direction,
              role: this.role,
              keyMap: this._keyMap,
              align: this.align
            }));
          }
        }
      }




      // if (direction) {

      //   window.alert(this.role);

      //   // this.socket.emit('message', JSON.stringify({
      //   //   cmd: 'MOVE_PERSON',
      //   //   direction: direction
      //   // }));

      //   // const handleMoving = (data) => {
      //   //   this.props.onResponderGrant();
      //   //   this.props.onSwipe(data.direction)
      //   //   this.socket.off('MOVE_PERSON_APPROVED', handleMoving);
      //   // }

      //   // this.socket.on('MOVE_PERSON_APPROVED', handleMoving);
      // }

    } else {
      if (this._keyMap) {
        const direction = this._keyMap[e.code];
        if (direction) {
          this.props.onSwipe(direction);
        }
      }
    }
  };

  _handleShouldSetPanResponder = (evt, gestureState) => {
    evt.preventDefault();
    return evt.nativeEvent.touches.length === 1;
  };

  _gestureIsClick = (gestureState) => {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
  };

  _handlePanResponderEnd = (evt, gestureState) => {
    evt.preventDefault();
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  };

  _triggerSwipeHandlers = (swipeDirection, gestureState) => {
    const {
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      onTap,
    } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    onSwipe && onSwipe(swipeDirection, gestureState);
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
      case SWIPE_UP:
        onSwipeUp && onSwipeUp(gestureState);
        break;
      case SWIPE_DOWN:
        onSwipeDown && onSwipeDown(gestureState);
        break;
      default:
        onTap && onTap(gestureState);
        break;
    }
    // console.log("swipeDrection = ", swipeDirection);
    // if (swipeDirection) {
      this.socket.emit('message', JSON.stringify({
        cmd: 'MOVE_PERSON',
        direction: swipeDirection?swipeDirection:SWIPE_UP,
        role: this.role,
        keyMap: this._keyMap,
        align: this.align
      }));
    // }
  };

  // _getSwipeDirection = (gestureState) => {
  //   const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
  //   const { dx, dy } = gestureState;
  //   console.log("dx dx", dx, dy);
  //   if (this._isValidHorizontalSwipe(gestureState)) {
  //     console.log("----horizeontal");
  //     return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
  //   } else if (this._isValidVerticalSwipe(gestureState)) {
  //     console.log("------vertial");
  //     return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
  //   }
  //   console.log("------none");
  //   return null;
  // };

  _getSwipeDirection = (gestureState) => {
    const { dx, dy } = gestureState;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
  
    // Threshold to define a valid swipe
    const SWIPE_THRESHOLD = 20;
  
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal Swipe
      if (dx > SWIPE_THRESHOLD) {
        return SWIPE_RIGHT;
      } else if (dx < -SWIPE_THRESHOLD) {
        return SWIPE_LEFT;
      }
    } else {
      // Vertical Swipe
      if (dy > SWIPE_THRESHOLD) {
        return SWIPE_RIGHT;
      } else if (dy < -SWIPE_THRESHOLD) {
        return SWIPE_UP;
      }
    }
  };

  _isValidHorizontalSwipe = (gestureState) => {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  };

  _isValidVerticalSwipe = (gestureState) => {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  };

  touchStart = (evt) => {
    console.log("touch start");
    // evt.preventDefault();
    this.props.onResponderGrant();
  };

  render() {
    const { style, ...props } = this.props; 
    // const {socket} = useContext(GameContext);


    return (
      <View
        style={[{ flex: 1, cursor: "pointer" }, style]}
        tabIndex="0"
        ref={(view) => {
          const nextView = getElement(view);
          if (nextView && nextView.addEventListener) {
            nextView.addEventListener("touchstart", this.touchStart, false);
            nextView.addEventListener("touchmove", freezeBody, false);
          }
          if (this.view && this.view.removeEventListener) {
            this.view.removeEventListener("touchstart", this.touchStart, false);
            this.view.removeEventListener("touchmove", freezeBody, false);
          }
          this.view = nextView;
        }}
        {...props}
        {...this._panResponder.panHandlers}
      />
    );
  }
}

export default GestureView;
 