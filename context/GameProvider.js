import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameContext from "./GameContext";
import { keyMap_None } from "../global/keyMap";
import { Animated, View, Image, Dimensions } from "react-native";
import { getDepositAddress } from "../global/global";

let STORAGE_KEY = "@BouncyBacon:Character";
let defaultState = { character: "bacon", highscore: 0 };

// const STORAGE_KEY = "@BouncyBrent:Character";
// const defaultState = { character: "brent", highscore: 0 };
// const STORAGE_KEY = "@BouncyAvocoder:Character";
// const defaultState = { character: "avocoder", highscore: 0 };
// const STORAGE_KEY = "@BouncyBrent:Character";
// const defaultState = { character: "brent", highscore: 0 };
// const STORAGE_KEY = "@BouncyPalmer:Character";
// const defaultState = { character: "palmer", highscore: 0 };
// const STORAGE_KEY = "@BouncyJuwan:Character";
// const defaultState = { character: "juwan", highscore: 0 };

const SHOULD_REHYDRATE = true;

// async function cacheAsync(value) {
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
// }


export default function GameProvider({ children }) {
 
  async function rehydrateAsync() {
    if (!SHOULD_REHYDRATE || !AsyncStorage) {
      return defaultState;
    }
    try {
      const item = await AsyncStorage.getItem(STORAGE_KEY);
      const data = JSON.parse(item);
      return data;
    } catch (ignored) {
      return defaultState;
    }
  }
  const [user, setUser] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [character, setCharacter] = useState(defaultState.character);
  const [otherCharacter, setOtherCharacter] = useState(defaultState.character);
  const [highscore, setHighscore] = useState(defaultState.highscore);
  const [gameMode, setGameMode] = useState(0); // 0 : PVE , 1 : PVP
  const [contextGameMap, setContextGameMap] = useState([]);
  const [role, setRole] = useState("");
  const [cUserName, setCUserName] = useState(""); 
  const [keyMap_Server, setKeyMap_Server] = useState(keyMap_None);
  const [keyMap_Client, setKeyMap_Client] = useState(keyMap_None);
  const [socket, setSocket] = useState();
  const [wallet, setWallet] = useState("");
  const [rate, setRate] = useState(0);
  const [myRoomInfo, setMyRoomInfo] = useState({
    room_state : "closed", // or 'opened'
    room_name : "",
    room_path : "",
    room_my_role : 0, // 0 : server, 1 : client
    amount: 0,
    client_ready: true,
    deposited1:false,
    deposited2:false,
    otherOver:false,
    players : [{
      player_name : "",
      player_id : "",
      player_state : 1, // 0 : not joined, 1 : joined
    },{
      player_name : "",
      player_id : "",
      player_state : 0, // 0 : not joined, 1 : joined
    }]
  })

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(Dimensions.get('window').width < evalWidth);
      setIsPC(Dimensions.get('window').width >= evalWidth);
    };
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => {
      subscription?.remove(); // Clean up the listener
    };
    
  }, []);


  /* ================================ For Mobile Responsive ===============================*/

  /* ================================ For Loading Components  ===========  ====================*/

  const [rotateValue, setRotateValue] = useState(0);
  const [innerLoading,   setInnerLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [intervalId, setIntervalId] = useState(-1);

  /* ================================ For Loading Components  ==================  =============*/

  const startAnimation = () => {
    const _intervalId = setInterval(() => {
      setRotateValue(prev => {
        return (prev + 1) % 360;
      });
    }, 5);

    setIntervalId(_intervalId);
  };

  useEffect(() => {
    if (loadingState) {
      startAnimation(); // Start the animation when the component mounts
      setInnerLoading(true);
    } else {
      setTimeout(() => {
        setInnerLoading(false);
        if (intervalId != -1) {
          clearInterval(intervalId);
          setIntervalId(-1);
        }
      }, 1000);
    }
  }, [loadingState]);

  React.useEffect(() => {
    const parseModulesAsync = async () => {
      try {
        const { user, character, highscore, gameMode, contextGameMap, role, keyMap_Server, keyMap_Client, wallet } = await rehydrateAsync();
        setUser(user);
        setCharacter(character);
        setOtherCharacter(otherCharacter);
        setHighscore(highscore);
        setGameMode(gameMode);
        setContextGameMap(contextGameMap);
        setRole(role);
        setKeyMap_Server(keyMap_Server);
        setKeyMap_Client(keyMap_Client);
        setWallet(wallet);
        setCUserName(cUserName);
      } catch (ignored) { }
    };

    parseModulesAsync();
  }, []);

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        setUserInfo,
        loadingState,
        setLoadingState,
        character,
        setCharacter,
        otherCharacter,
        setOtherCharacter,
        highscore,
        setHighscore,
        gameMode,
        setGameMode,
        contextGameMap,
        setContextGameMap,
        role,
        setRole,
        keyMap_Server,
        setKeyMap_Server,
        keyMap_Client,
        setKeyMap_Client,
        socket,
        setSocket,
        myRoomInfo,
        setMyRoomInfo,
        wallet,
        setWallet,
        rate,
        setRate,
        cUserName,
        setCUserName
      }}
    >
      {innerLoading == true &&
        <View
          style={{
            zIndex: 5000,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: "center",
            alignItems: "center",
            background: 'rgba(0,255,0,0.1)',

          }}>
          <Image
            source={require("../assets/crossy_logo.png")}
            style={{
              width: isPC ? 200 : 100,
              height: isPC ? 200 : 100,
              borderRadius: 100,
              borderWidth: 4,
              borderColor: 'gray',
              transform: `rotateY(${rotateValue}deg)`,
              // filter: 'grayscale(1)'
            }}
          />
        </View>
      }
      {children}
    </GameContext.Provider>
  );
}
