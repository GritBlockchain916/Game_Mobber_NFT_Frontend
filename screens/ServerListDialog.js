import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import GameContext from "../context/GameContext";

const server_headers = ["No", "Server", "Information"];
import { keyMap_1, keyMap_2, keyMap_Both, keyMap_None } from "../global/keyMap";

const ServerListDialog = ({ onClose, opened, socket }) => {

  const { gameMode, setGameMode,
    keyMap_Client, setKeyMap_Client,
    role, setRole,
    contextGameMap, setContextGameMap } = React.useContext(GameContext);

  const navigation = useNavigation();

  if (!opened) {
    return null;
  }

  const joinGame = (room_name) => {
    socket.emit('message', JSON.stringify({
      cmd: 'JOIN_GAME',
      name: room_name
    }));
  }

  const renderServerItem = ({ item, index }) => (
    <View style={{
      marginBottom: '20px',
      padding: '10px',
      // background : 'rgba(255,255,255,0.8)',
      flex: 1,
      flexDirection: 'row',
    }}>
      {/* <div style={{ minWidth: '150px', textAlign: 'left', color: 'white' }}>{item.id}</div> */}
      <div style={{ margin: 'auto', textAlign: 'left', color: 'white' }}>{item.name}</div>
      <div style={{ margin: 'auto', textAlign: 'left', color: 'white' }}>

        <button style={{
          width: '100px',
          height: '40px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          cursor: 'pointer',
          color: 'white'
        }}
          disabled={item.status > 0 || item.mine}
          onClick={() => { joinGame(item.name) }}
        >{item.mine ? "My Server" :
          (item.status == 0 ? "JOIN" : "Playing")
          }</button>
      </div>
      {/* <Text>Players: {item.players}/{item.maxPlayers}</Text> */}
    </View >
  );

  const [servers, setServers] = useState([]);

  const refreshServers = () => {
    socket.emit('message', JSON.stringify({
      cmd: 'GET_SERVERS'
    }));
  }

  useEffect(() => {
    const handleSocketRoom = (data) => {
      if (data.cmd == 'GOT_SERVERS') {
        setServers(data.servers);
      } else if (data.cmd == 'GOT_JOINED_TO_CLIENT') {
        // Set the Network-Game mode.
        setGameMode(2);
        setRole('client');
        setKeyMap_Client(keyMap_2);

        console.log("NEW MAP RECEIVED FROM SERVER");
        setContextGameMap(data.globalMap);

        // window.alert('client');

        start_game();
      }
    };

    socket.on('ROOM', handleSocketRoom);

    return () => {
      socket.off('ROOM', handleSocketRoom);
    };
  }, []);

  const start_game = () => {
    navigation.navigate("GameScreen_2");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Servers</Text>

      <View style={{ width: '80%', justifyContent: 'center', margin: 'auto', flex: 1, flexDirection: 'column' }}>

        {/* <View style={{
          marginBottom: '40px',
          padding: '10px',

          flex: 1,
          flexDirection: 'row',
        }}>
          {server_headers.map(header => {
            return <div style={{
              minWidth: '150px',
              textAlign: 'left',
              color: 'white',
              fontSize: '20px',
              textDecoration: 'underline',
              fontWeight: '800'

            }}>{header}</div>
          })}
        </View> */}

        <FlatList data={servers}
          renderItem={renderServerItem}
        // keyExtractor={server => server.id.toString()}
        >

        </FlatList>

        <View style={{ width: '100%', maxHeight: '100px', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <button style={{
            width: '160px',
            height: '40px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '24px',
            borderRadius: '20px',
            letterSpacing: '3px',
            cursor: 'pointer',
            margin: 'auto',
          }} onClick={refreshServers} > Refresh </button>
          <button style={{
            width: '160px',
            height: '40px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '24px',
            borderRadius: '20px',
            letterSpacing: '3px',
            cursor: 'pointer',
            margin: 'auto',

          }} onClick={() => onClose(false)} > Cancel </button>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: '100px',
    zIndex: 5000,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    width: '60%',
    height: '60%',
    overflowY: scroll,
    background: 'rgba(26,26,26,1)',
    border: '2px solid white',
    left: '20%',
    right: '20%',
    top: '30%',
    bottom: '10%'
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

export default ServerListDialog;
