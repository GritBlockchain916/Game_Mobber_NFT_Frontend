import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Share, StyleSheet, View } from 'react-native';
import { isAvailableAsync } from 'expo-sharing';

import GameContext from '../../context/GameContext';
import Colors from '../../src/Colors';
import Images from '../../src/Images';
import State from '../../src/state';
import Button from '../Button';

import { useNavigation } from "@react-navigation/native";

async function shareAsync() {
  await Share.share(
    {
      message: `Check out Mobber Game by @baconbrix`,
      url: 'https://crossyroad.netlify.com',
      title: 'Mobber Game',
    },
    {
      dialogTitle: 'Share Mobber Game',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.AirDrop', // This speeds up showing the share sheet by a lot
        'com.apple.UIKit.activity.AddToReadingList', // This is just lame :)
      ],
      tintColor: Colors.blue,
    },
  );
}

export default function Footer({ style, showSettings, setGameState, navigation }) {

  const [canShare, setCanShare] = useState(true);

  const { socket, gameMode } = React.useContext(GameContext);

  const gotoMenu = () => {
    window.alert("haa:" + gameMode);
    if (gameMode == 2) {

      socket.emit('message', JSON.stringify({
        cmd: 'END_GAME',
      }));
    } else {
      navigation.navigate("LandingScreen");
    }
  };

  useEffect(() => {
    isAvailableAsync().then(setCanShare).catch(() => { });
  }, []);

  LayoutAnimation.easeInEaseOut();

  return (
    <View style={[styles.container, style]}>

      {/* MBC- */}

      {/* <button
        style={{
          // position: 'absolute',
          borderRadius: '50px',
          padding: '10px 20px',
          background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
          border: '2px solid #333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 2000,
          right: '30px',
          top: '30px',
          cursor: 'pointer',
          fontSize: '24px',
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'background 0.3s, transform 0.2s',
        }}
        onClick={gotoMenu}
      >
        Back to Menu
      </button> */}

      {/* <Button
        onPress={() => {
          showSettings()
        }}
        imageStyle={[styles.button, { aspectRatio: 1.25 }]}
        source={Images.button.settings}
      />
      {canShare && <Button
        onPress={shareAsync}
        imageStyle={[styles.button, { marginRight: 4, aspectRatio: 1.9 }]}
        source={Images.button.share}
      />} */}
      {/* <Button
        onPress={() => {
          setGameState(State.Game.none);
        }}
        imageStyle={[styles.button, { marginLeft: canShare ? 4 : 0, aspectRatio: 1.9 }]}
        source={Images.button.long_play}
      /> */}
      {/* <Button
        onPress={() => {
          console.log('Game Center'); //TODO: Add GC
        }}
        imageStyle={[styles.button, { aspectRatio: 1.25 }]}
        source={Images.button.rank}
      /> */}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingHorizontal: 4,
    minHeight: 56,
    maxHeight: 56,
    minWidth: '100%',
    maxWidth: '100%',
    flex: 1,
  },
  button: {
    height: 56,
  },
});
