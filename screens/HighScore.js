import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import GameContext from "../context/GameContext";

const server_headers = ["No", "Server", "Information"];
import { keyMap_1, keyMap_2, keyMap_Both, keyMap_None } from "../global/keyMap";

const HighScoreDialog = ({ onClose, opened }) => {
  if (!opened) return null;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>

      <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'column' }}>

        <View style={styles.scoreItem}>
          <View style = {{width : '20px'}}>🥇</View>
          <View>Deagle</View>
          <View>500</View>
        </View>
        <View style={styles.scoreItem}>
          <View style = {{width : '20px'}}>🥈</View>
          <View>CryptoLead</View>
          <View>100</View>
        </View>
        <View style={styles.scoreItem}>
          <View style = {{width : '20px'}}>🥉</View>
          <View>GloryDream413</View>
          <View>50</View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <button style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '24px',
            borderRadius: '20px',
            letterSpacing: '3px',
            cursor: 'pointer',
            margin: 'auto',
          }}  > Refresh </button>
          <button style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '24px',
            borderRadius: '20px',
            letterSpacing: '3px',
            cursor: 'pointer',
            margin: 'auto',

          }} onClick={() => {
            onClose(false);
          }}  > Cancel </button>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width : '100%',
    justifyContent : 'center',
    borderRadius: '100px',
    zIndex: 5000,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    overflowY: scroll,
    backgroundColor: 'rgba(26,26,26,1)',
    border: '2px solid white',
    width : '30%'
  },
  scoreItem : {
    height : '4rem',
    margin : '2rem',
    color : 'white',
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'space-between',
    fontSize : '2rem',
    textAlign : 'center'
  },

  buttons: {
    background: 'red'
  },

  title: {
    marginBottom: '25px',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: '32px'
  },
  serverItem: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default HighScoreDialog;
