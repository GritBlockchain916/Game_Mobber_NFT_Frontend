import React, { Component, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import Hand from "../components/HandCTA";
import Footer from "../components/Home/Footer";
import GameContext from "../context/GameContext";


const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
const halfScreenHeight = - screenHeight / 2;

let hasShownTitle = false;

function Screen(props) {

  const {
    // set the socket to the context
    socket, setSocket,
    // set gameMode to the context
    gameMode, setGameMode,
    // set the globalKepMap to the context : MBC-on update
    keyMap_Server, setKeyMap_Server,
    // set the role to the context : MBC-on on update
    role, setRole,
    // set the global map to the context 
    contextGameMap, setContextGameMap ,
    adminWallet, setAdminWallet
  } = React.useContext(GameContext);

  // const { setCharacter, character, gameMode, role, socket } = React.useContext(GameContext);
  const animation = new Animated.Value(0);


  useEffect(() => {
    const handleSocketPlayGame = (data) => {
      // window.alert("I will play as a ", data.role);
      props.onPlay();
    }

    // getWalletAddress();
  
    socket.on('PLAY_GAME_APPROVED', handleSocketPlayGame);
  },[])

  React.useEffect(() => {
    function onKeyUp({ keyCode }) {
      if ([32].includes(keyCode)||[38].includes(keyCode)) {
        if (gameMode == 2) {
          // window.alert("play game :", role);
          socket.emit('message', JSON.stringify({
            cmd: 'PLAY_GAME',
            role: role
          }));
        } else {
          props.onPlay();
        }
      }
    }

    function onMouseClick(event) {
      if (gameMode == 2) {
        // window.alert("play game :", role);
        socket.emit('message', JSON.stringify({
          cmd: 'PLAY_GAME',
          role: role
        }));
      } else {
        props.onPlay();
      }
    }


    window.addEventListener("keyup", onKeyUp, false);
    // window.addEventListener("click", onMouseClick, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      // window.addEventListener("click", onMouseClick, false);
    };

  }, []);

  React.useEffect(() => {
    if (!hasShownTitle) {
      hasShownTitle = true;
      InteractionManager.runAfterInteractions((_) => {
        Animated.timing(animation, {
          useNativeDriver: true,
          toValue: 1,
          duration: 800,
          delay: 0,
          easing: Easing.in(Easing.qubic),
        }).start();
      });
    }
  }, []);

  const { top, bottom, left, right } = useSafeArea();

  const animatedTitleStyle = {
    transform: [

    ],
  };
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPressIn={() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.in(Easing.qubic),
            onComplete: ({ finished }) => {
              if (finished) {

              }
            },
          }).start();
        }}
      >
        <Text style={styles.coins}>{props.coins}</Text>
        {gameMode == 0 ? (
          <Animated.Image
            source={require("../assets/images/title.png")}
            style={[styles.title, animatedTitleStyle, {
              borderRadius: '2px solid red'
            }]}
          />
        ) : (
          <Animated.Image
            source={require("../assets/images/title.png")}
            style={[styles.title_2, animatedTitleStyle, {
              borderRadius: '2px solid red'
            }]}
          />
        )}


        <View
          style={{
            justifyContent: "center",
            alignItems: "stretch",
            position: "absolute",
            bottom: Math.max(bottom, 8),
            left: Math.max(left, 8),
            right: Math.max(right, 8),
          }}
        >
          <View style={{ height: 64, marginBottom: 48, alignItems: "center" }}>
            {!__DEV__ && <Hand style={{ width: 36 }} />}
          </View>
          {/* <Footer
            onCharacterSelect={() => {
              // TODO(Bacon): Create a character select page
            }}
            onShop={() => { }}
            onMultiplayer={() => { }}
            onCamera={() => { }}
          /> */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    // color: 'white',
    // fontSize: 48,
    // backgroundColor: 'transparent',
    // textAlign: 'center',
    resizeMode: "contain",
    // maxWidth: 600,
    width: "100%",
    height: 300,
    marginTop: - screenHeight
  },
  title_2: {
    // color: 'white',
    // fontSize: 48,
    // backgroundColor: 'transparent',
    // textAlign: 'center',
    resizeMode: "contain",
    // maxWidth: 600,
    width: "100%",
    height: 300,
    marginTop: - screenHeight
  },
  coins: {
    fontFamily: "retro",
    position: "absolute",
    right: 8,
    color: "#f8e84d",
    fontSize: 36,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "right",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
