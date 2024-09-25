/********************************************************************** The Road to Valhalla! ************************************************************************
 *                                                                                                                                                                   *
 *  📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌           *
 *  📌                                                                                                                                                  📌         *
 *  📌                                                                                                                                                  📌        *
 *  📌     📌            📌    📌📌         📌           📌       📌         📌📌        📌             📌                      📌📌             📌        *
 *  📌      📌          📌    📌  📌        📌           📌       📌        📌  📌       📌             📌                     📌  📌            📌       *
 *  📌       📌        📌    📌    📌       📌           📌       📌       📌    📌      📌             📌                    📌    📌           📌       *
 *  📌        📌      📌    📌      📌      📌           📌       📌      📌      📌     📌             📌                   📌      📌          📌       *
 *  📌         📌    📌    📌📌📌📌📌     📌            📌📌📌📌📌    📌📌📌📌📌    📌              📌                  📌📌📌📌📌         📌       *
 *  📌          📌  📌    📌          📌    📌           📌       📌    📌         📌   📌              📌                 📌          📌        📌       *
 *  📌           📌📌    📌            📌   📌           📌       📌   📌           📌  📌              📌                📌            📌       📌       *
 *  📌            📌    📌              📌  📌📌📌📌📌 📌        📌  📌            📌 📌📌📌📌📌    📌📌📌📌📌📌   📌              📌      📌       *
 *  📌                                                                                                                                                  📌      *
 *  📌                                                                                                                                                  📌      *
 *  📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌      *
 *                                                                                                                                                             *
 *  Project Type  : CrossyGame with NFT management                                                                                                            *
 *   Project ID   : 2024-2                                                                                                                                   *
 *   Client Info  : Private                                                                                                                                 *
 *    Developer   : Rothschild (Nickname)                                                                                                                  *
 *   Source Mode  : 100% Private                                                                                                                          *
 *   Description  : CrossyGame project with NFT as a service.                                                                                            *
 *  Writing Style : P0413-K0408-K1206                                                                                                                   *
 *                                                                                                                                                     *
 ********************************************************************** The Road to Valhalla! *********************************************************
 */
// Sample Libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";

// Personal informations MBC-
import GameContext from "../context/GameContext";
import { keyMap_1, keyMap_2, keyMap_Both, keyMap_None } from "../global/keyMap";

// Global variables : MBC-on mobile responsive

const JoiningDialog = ({ onClose, opened, userName, otherName, roomPath, serverId }) => {

  const navigation = useNavigation();
  const { socket, gameMode, keyMap_Client, setKeyMap_Client,
    role, setRole, contextGameMap, setContextGameMap, userNa } = React.useContext(GameContext);
  const [clientName, setClientName] = useState(otherName);

  useEffect(() => {
    setClientName(otherName);
  }, [otherName])

  // Deny everything on this condition
  if (!opened | !socket) {
    return null;
  }


  const handleSocketEndRoom = (data) => {
    if (data.who == "server") {
      onClose(false);
      navigation.navigate("LandingScreen");
    } else if (data.who == 'client') {
      setClientName("waiting...");
    }
  }

  socket.on('END_ROOM', handleSocketEndRoom);

  return (
    <View style={styles.container}>
      <img src={require("../assets/images/close.jpg")} style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        borderRadius: '50%',
        width: '2rem',
        cursor: 'pointer',
        zIndex: 6000
      }}
        onClick={() => {
          socket.emit("message", JSON.stringify({ cmd: 'END_ROOM' }));
        }}

      ></img>

      {/* if this is the server */}
      {serverId == "" &&
        <View style={styles.players}>
          <View style={styles.player1}>
            <h1>{userName}</h1>
            <img src={require("../assets/avatar/avatar_server.jpg")}
              style={{
                width: '200px', borderRadius: '50%', margin: '1rem', boxShadow: '10px 10px 10px rgba(255,0,0,0.4)'
              }}></img>
          </View>

          {clientName == "waiting..." ?
            <View style={styles.player2}>
              <h1>{clientName}</h1>
              <img
                src={require("../assets/avatar/hourglass.png")}
                style={{
                  width: '200px',
                  filter: 'grayscale(1)',
                  borderRadius: '50%',
                  margin: '1rem',
                  boxShadow: '10px 10px 10px rgba(255, 0, 0, 0.4)',
                  animation: 'spin 2s linear infinite'
                }}
              />
            </View>
            :
            <View style={styles.player1}>
              <h1>{clientName}</h1>
              <img src={require("../assets/avatar/avatar_client.jpg")}
                style={{
                  width: '200px', borderRadius: '50%', margin: '1rem', boxShadow: '10px 10px 10px rgba(255,0,0,0.4)'
                }}></img>
            </View>
          }

        </View>
      }

      {/* if this is the client */}
      {serverId != "" &&
        <View style={styles.players}>

          <View style={styles.player1}>
            <h1>{otherName}</h1>
            <img src={require("../assets/avatar/avatar_server.jpg")}
              style={{
                width: '200px', borderRadius: '50%', margin: '1rem', boxShadow: '10px 10px 10px rgba(255,0,0,0.4)'
              }}></img>
          </View>

          <View style={styles.player1}>
            <h1>{userName}</h1>
            <img src={require("../assets/avatar/avatar_client.jpg")}
              style={{
                width: '200px', borderRadius: '50%', margin: '1rem', boxShadow: '10px 10px 10px rgba(255,0,0,0.4)'
              }}></img>
          </View>
        </View>
      }

      <View style={styles.linkPad}>
        <input style={{ padding: '0.5rem', margin: '1rem', flex: 1, border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f5f5f5', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', outline: 'none', fontSize: '1rem', color: '#333', transition: 'box-shadow 0.3s, border-color 0.3s', lineHeight: '1.5' }}
          value={roomPath}
          type="text" placeholder="Getting the room link from the server ..."
          disabled
          autoFocus />
        <button className="decoration-button" onClick={() => {
          navigator.clipboard.writeText(roomPath)
            .then(() => {
              // window.alert(roomPath);
            })
            .catch(err => {
              window.alert("error link");
            });
        }} >&nbsp;Copy Link!&nbsp;</button>
        {/* <button className="decoration-button" onClick={() => {
        }} >Cancel</button> */}
      </View>

      <View style={styles.startPad}>
        <button className="decoration-button"
          style={{ width: '100%' }}
          onClick={() => {
            if (serverId == "") {
              // navigation.navigate("GameScreen_2");

              if (clientName != "waiting...") {
                socket.emit('message', JSON.stringify({
                  cmd: 'START_GAME',
                  msg: "Let's start game!",
                  role: 'server'
                }));
              }

            } else {
              // window.alert(role);
              // window.alert("Only the server can start game");
            }
          }}
        // disabled={serverId!=""}
        >&nbsp;START NOW&nbsp;</button>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // width: '80%',
    // height: '60%',
    borderRadius: '2rem',
    zIndex: 5000,
    backgroundColor: 'rgba(26,26,26,1)',
    border: '2px solid gray',
    // left: '10%', right: '10%',
    // top: '10%', bottom: '10%',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between'
  },
  players: {

    display: 'flex', flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rounding: {
    margin: '1rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    height: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    display: 'flex'
  },

  player1: {
    padding: '2rem',
    margin: '1rem',
    // borderRadius: '2rem',
    // backgroundColor: 'rgba(255,255,255,0.1)',
    // border: '1px solid red',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '2rem',
    justifyContent: 'center',
    alignItems: 'center',

  },

  playerVS: {
    padding: '1rem',
    margin: '1rem',
    borderRadius: '2rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid red',
    width: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  player2: {
    padding: '2rem',
    margin: '1rem',
    // borderRadius: '2rem',
    // backgroundColor: 'rgba(255,255,255,0.1)',
    // border: '1px solid red',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '2rem',
    justifyContent: 'center',
    alignItems: 'center',

  },

  linkPad: {
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
    marginBottom: '0px',
    paddingLeft: '2rem',
    paddingRight: '2rem'
  },

  startPad: {
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingBottom: '2rem'
  }
});


export default JoiningDialog;
