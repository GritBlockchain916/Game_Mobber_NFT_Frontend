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
 *  Writing Style : P0413-K0408-K1206                                                                                                                   *                                                                                                                                                      *
 *                                                                                                                                                     *
 ********************************************************************** The Road to Valhalla! *********************************************************
 */

// Sample Libraries
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Image, Platform, Dimensions, Linking, Alert } from 'react-native';

// Personal informations
import GameContext from '../context/GameContext';
import ServerListDialog from './ServerListDialog';
import { globalMap } from "../global/globalMap";
import { keyMap_1, keyMap_2, keyMap_Both, keyMap_None } from "../global/keyMap";
import JoiningDialog from './JoiningDialog';
import HighScoreDialog from './HighScore';
import HeaderScreen from "./HeaderScreen";
import { getDepositAddress } from "../global/global";

import { fonts } from '../global/commonStyle';
import { socket, FRONTEND_URL, SERVER_URL, registerUser, loginUser, getRate } from '../global/global';

import { commonStyle } from '../global/commonStyle';
import { cacheRate } from '../src/GameSettings';
import { getUserInfo } from '../global/global';
import toast from 'react-hot-toast';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { useWeb3ModalProvider } from '@web3modal/solana/react'
import { deepCopy } from '../global/common';
// const { address, chainId } = useWeb3ModalAccount();

// Landing Page component
const LandingScreen = () => {

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const { walletProvider, connection } = useWeb3ModalProvider();
  const getWalletAddress = async () => {
    let response = await getDepositAddress();
    // console.log("VVVVVVVVVVVV  ", response.data.data.depositAddress);
    let add = response.data.data.depositAddress;
    // console.log("TTTTTTTTTTTT ", add);
    setAdminWallet(add);
    // console.log("VVVVVVVVVVVV  ", adminWallet);
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    // getWalletAddress();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  // Initial Variables
  const navigation = useNavigation();
  const {
    // set the socket to the context
    setSocket,
    // set gameMode to the context
    gameMode, setGameMode,
    // set the globalKepMap to the context : MBC-on update
    keyMap_Server, setKeyMap_Server,
    // set the role to the context : MBC-on on update
    role, setRole,
    // set the global map to the context
    contextGameMap, setContextGameMap,
    // Loading state
    setLoadingState,
    // Room State
    myRoomInfo, setMyRoomInfo,
    adminWallet, setAdminWallet,
    userInfo,
    setUserInfo,
    cUserName,
    setCUserName
  } = React.useContext(GameContext);

  // Initial hook functions
  useEffect(() => {
    setSocket(socket);
    Linking.getInitialURL().then(url => {
      if (url) {
        const _serverId = url.split('/?')[1];
        console.log("server id : ", _serverId);
        if (_serverId) {
          setServerId(_serverId);
        }
        setRoomPath(FRONTEND_URL + "/?" + _serverId);
      }
    }).catch(err => console.error('An error occurred', err));
  }, []);

  // Personal variables
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(1);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // const [cUserName, setCUserName] = useState(""); // MBC - Name
  const [onRegister, setOnRegister] = useState(false);
  const [otherName, setOtherName] = useState("waiting...");

  const [roomPath, setRoomPath] = useState(FRONTEND_URL);
  const [openRoom, setOpenRoom] = useState(false);
  const [openHighScore, setOpenHighScore] = useState(false);
  const [serverId, setServerId] = useState('');

  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [stateMsg, setStateMsg] = useState("");

  const [path, setPath] = useState("home");

  const registering = async () => {
    if (regName == '') {
      setStateMsg("Input Your Name");
      return;
    }
    if (regPassword == '' || regConfirm != regPassword) {
      setStateMsg("Password is not correct");
      return;
    }
    let response = await registerUser(regName, regPassword);
    if (response.data.code == "00") {
      setStateMsg("");
      setOnRegister(false);
    }
    else {
      setStateMsg(response.data.message);
    }

  }

  const entering = async () => {

    if (!walletProvider || !connection) {
      toast.error('Import wallet');
      return;
    }
    if (localStorage.wallet == undefined) {
      setStateMsg("Import Wallet");
      return;
    }
    let response = await loginUser(userName, localStorage.wallet);

    console.log("User Login: ", response);

    if (response.data.code == "00") {
      setCUserName(userName);
      setStateMsg("");
      localStorage.token = response.data.token;
      let rateResponse = await getRate();
      if (rateResponse.data.code == "00") {
        if (rateResponse?.data?.data?.rate)
          localStorage.rate = rateResponse?.data?.data?.rate;
        // else toast("Set reward rate!")
      } else {
        toast("Reward Rate setting failed!")
      }

      // console.log("$$$$$$$$$$$$ ", localStorage.token, localStorage.rate);
      let newInfo = deepCopy(userInfo)
      getUserInfo(localStorage.token).then(res => {
        if (res.data.code == "00") {
          newInfo.character = res.data.data?.character;
          newInfo.id = res.data.data?.id;
          newInfo.nft = res.data.data?.nft;
          newInfo.score = res.data.data?.score;
          newInfo.username = res.data.data?.username;
          setUserInfo(newInfo)
        }
      })
      console.log("userInfo ====> ", userInfo)
    }
    else {
      setStateMsg(response.data.message)
    }
  }
  // Receiving events from the server
  useEffect(() => {
    const getCashRate = () => {
      cacheRate = 0.1;
    }

    const handleSocketRoom = (data) => {
      if (data.cmd === "SIGNAL_ROOM_CREATED") {
        setLoadingState(false);

        if (data.status) {
          setGameMode(2);
          setRole('server');

          setMyRoomInfo(prevRoomInfo => ({
            ...prevRoomInfo,
            room_state: 'opened',
            room_name: data.name,
            room_path: FRONTEND_URL + "/?" + data.name,
            room_my_role: 0,
            client_read: true,
            deposit1: false,
            deposit2: false,
            amount: 0,
            otherOver: false,
            players: data.players
          }));

          // console.log("After creating room : ", myRoomInfo);
          navigation.navigate("GameRoomScreen");
        } else {
          window.alert(data.msg);
        }
      }
      else if (data.cmd == "SIGNAL_ROOM_JOINED") {
        console.log("@@@@@@@@@@@@@@@@@@@@SIGNAL_ROOM_JOINED ", data);
        setLoadingState(false);
        if (data.status) {
          setLoadingState(false);
          // Client JOINED
          if (data.role == 'server') {
            setRole('server');
            setGameMode(2);
            setContextGameMap(data.globalMap);

            setMyRoomInfo(prevRoomInfo => ({
              ...prevRoomInfo,
              room_state: 'opened',
              room_my_role: 0,
              players: data.players,
              amount: 0
            }));

            console.log("Joined : ", myRoomInfo);

          } else if (data.role == 'client') {
            setRole('client');
            setGameMode(2);
            setContextGameMap(data.globalMap);

            setMyRoomInfo(prevRoomInfo => ({
              ...prevRoomInfo,
              room_state: 'opened',
              room_my_role: 1,
              players: data.players,
              amount: data.amount
            }));

            console.log("Joined : ", myRoomInfo);
            console.log("Data : ", data);

            // When server close the room
            if (data.players[0].player_state == 0 && data.players[1].player_state == 0) {
              window.alert("Player1 closed the room.");
              setServerId(undefined);
              navigation.navigate("LandingScreen");
            } else {
              navigation.navigate("GameRoomScreen");
            }
          } else {
            window.alert("Someone joined in an untracked way!");
            return;
          }
        } else {
          window.alert(data.msg);
        }
      }

      if (data.cmd == "SIGNAL_GAME_STARTED") {
        if (data.status) {
          // window.alert("started");
          setGameMode(2);
          navigation.navigate("GameScreen");
        } else {
          window.alert(data.msg);
        }
      }
      if (data.cmd == "START_GAME_APPROVED") {
        console.log("approve !!!!!!!!!!!!!!!!!!");
        navigation.navigate("GameScreen_2");
      }
    }

    getCashRate();

    console.log("--------------con1------");

    socket.on('ROOM', handleSocketRoom);

    return () => {
      socket.off('ROOM', handleSocketRoom);
    };
  }, []);

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Horizon'
    }}>
      <JoiningDialog
        userName={userName}
        otherName={otherName}
        roomPath={roomPath}
        opened={openRoom}
        serverId={serverId}
        onClose={setOpenRoom}
      />
      <HighScoreDialog
        opened={openHighScore}
        onClose={setOpenHighScore}
      />

      <HeaderScreen path={path}></HeaderScreen>

      <View style={{
        position: 'relative',
        height: isPC ? 'calc(100vh - 100px)' : 'calc(100vh)',
        background: 'black',
        display: 'flex',
        flexDirection: isPC ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {isPC &&
          <View style={{
            width: '50%', height: '100%',
            display: 'flex',
            borderRight: commonStyle.border
          }}>
            <Image source={cUserName == "" ? require("../assets/avatar/avatar_player1.png") : require("../assets/avatar/avatar_player2.png")}
              style={{
                width: '100%', height: '100%',
                margin: 'auto'
              }}
            />
          </View>
        }

        <View style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          columnGap: '10px',
          width: isPC ? '50%' : '100%',
          textAlign: 'center',
          alignItems: 'center',
          // rowGap: '25px',
          padding: '25px'
        }}>
          <Text style={{ color: 'white', fontSize: '20px', fontFamily: 'Horizon' }}>Welcome To</Text>
          <Text style={{
            fontSize: isPC ? '96px' : '72px',
            color: '#FDC6D3',
            WebkitTextStroke: '1px #EF587B',
            filter: 'drop-shadow(0px 0px 20px #EF587B)',
            fontWeight: '700',
            // textShadow: '0 0 5px #fff',
            fontFamily: 'Horizon'
          }}>MOBBER</Text>


          {
            onRegister ? <>
              <TextInput style={{
                // padding: '0.5rem',
                paddingTop: '15px',
                paddingBottom: "15px",
                paddingLeft: '36px',
                paddingRight: '36px',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                marginTop: '25px',
                marginBottom: '10px',
                textAlign: 'center',
                // lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
                fontSize: '20px'
              }}
                type="text" placeholder="Your Name"
                value={regName}
                onChange={(e) => {
                  setRegName(e.target.value);
                }}
                autoFocus />
              <TextInput style={{
                // padding: '0.5rem',
                paddingTop: '15px',
                paddingBottom: "15px",
                paddingLeft: '36px',
                paddingRight: '36px',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                marginBottom: '10px',
                textAlign: 'center',
                // lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
                fontSize: '20px'
              }}
                secureTextEntry={true} placeholder="Password"
                value={regPassword}
                onChange={(e) => {
                  setRegPassword(e.target.value);
                }}
              />
              <TextInput style={{
                // padding: '0.5rem',
                paddingTop: '15px',
                paddingBottom: "15px",
                paddingLeft: '36px',
                paddingRight: '36px',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                marginBottom: '10px',
                textAlign: 'center',
                // lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
                fontSize: '20px'
              }}
                secureTextEntry={true} placeholder="Confirm Password"
                value={regConfirm}
                onChange={(e) => {
                  setRegConfirm(e.target.value);
                }}
              />
              <Text style={{ color: 'red', fontSize: '14px', fontFamily: 'Horizon', marginBottom: '10px' }}>{stateMsg}</Text>
              <View style={{
                display: 'flex', flexDirection: 'row',
                marginTop: '10px', alignItems: 'center',
                columnGap: '10px'
              }}>
                <Text style={[commonStyle.button, { width: '150px' }]}
                  onClick={() => {
                    setOnRegister(false); setStateMsg("");
                  }}
                >
                  <SimpleIcon name="arrow-left" size={20} />
                  &nbsp;&nbsp;
                  Back
                </Text>
                <Text style={[commonStyle.button, { width: '150px' }]}
                  onClick={() => {
                    registering();
                  }}
                >
                  <SimpleIcon name="user-follow" size={20} />
                  &nbsp;&nbsp;
                  Register
                </Text>
              </View>
            </> :


              cUserName != "" ?
                <>
                  <Text style={{ marginTop: isPC ? '20px' : '5px', color: 'white', fontSize: isPC ? '36px' : '32px', fontFamily: 'Horizon' }}>
                    Hey, {cUserName} !
                  </Text>
                  <Text style={{ marginTop: '0px', color: 'white', fontSize: isPC ? '36px' : '32px', fontFamily: 'Horizon' }}>
                    Choose your Game
                  </Text>

                  <View style={{
                    display: 'flex',
                    flexDirection: isPC ? 'row' : 'column',
                    alignItems: 'center',
                    columnGap: '10px',
                    marginTop: isPC ? '45px' : '20px'
                  }}>
                    <Text style={{
                      ...commonStyle.button,
                      fontWeight: '800',
                      fontSize: '20px',
                      fontFamily: 'Horizon'
                    }}
                      onClick={() => {
                        setGameMode(0);
                        navigation.navigate("GameScreen");
     
                      }}
                    >
                      <SimpleIcon name="user" size={20} />
                      &nbsp;&nbsp;Play Single - P2E
                    </Text>

                    <Text style={{
                      color: 'gray', fontSize: '20px', fontFamily: 'Horizon'
                    }}>
                      OR
                    </Text>

                    <Text style={{
                      ...commonStyle.button,
                      fontWeight: '800',
                      fontSize: '20px',
                      fontFamily: 'Horizon'
                    }}
                      onClick={() => {
                        // navigation.navigate("DepositScreen");
                        setLoadingState(true);
                        if (serverId) {     // JOIN TO THE OTHER SERVER SPECIFIED IN THE SERVER ID
                          socket.emit('message', JSON.stringify({
                            cmd: 'ACTION_JOIN_GAME',
                            name: serverId.toString(),
                            player2: cUserName
                          }));
                        } else {
                          socket.emit('message', JSON.stringify({
                            cmd: 'ACTION_CREATE_ROOM',
                            player1: cUserName,
                            map: globalMap
                          }));
                        }
                      }}>
                      <SimpleIcon name="people" size={20} />
                      &nbsp;&nbsp;Play Multi - PVP
                    </Text>
                  </View>

                </>
                :
                <>
                  <TextInput style={{
                    // padding: '0.5rem',
                    paddingTop: '15px',
                    paddingBottom: "15px",
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    flex: 1,
                    border: '1px solid gray',
                    borderRadius: '30px',
                    background: 'transparent',
                    marginTop: isPC ? '25px' : '10px',
                    marginBottom: '10px',
                    textAlign: 'center',
                    // lineHeight: '2',
                    color: 'white',
                    fontFamily: 'Horizon',
                    fontSize: '20px'
                  }}
                    type="text" placeholder="Your Name"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    autoFocus />
                  {/* <TextInput style={{
                    // padding: '0.5rem',
                    paddingTop: '15px',
                    paddingBottom: "15px",
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    flex: 1,
                    border: '1px solid gray',
                    borderRadius: '30px',
                    background: 'transparent',
                    marginBottom: '20px',
                    textAlign: 'center',
                    // lineHeight: '2',
                    color: 'white',
                    fontFamily: 'Horizon',
                    fontSize: '20px'
                  }}
                    secureTextEntry={true} placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  /> */}

                  <Text style={{ color: 'red', fontSize: '14px', fontFamily: 'Horizon', marginBottom: '10px' }}>{stateMsg}</Text>
                  <View style={{
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: '10px'
                  }}>


                    <Text style={[commonStyle.button, { width: '150px' }]}
                      onClick={entering}
                    >
                      <SimpleIcon name="login" size={20} />
                      &nbsp;&nbsp;Enter Mobber
                    </Text>


                    {/*                     
                    <Text style={[commonStyle.button,{width: '150px'}]}
                      onClick={() => {
                        setOnRegister(true);
                      }}
                    >
                      <SimpleIcon name="user-follow" size={20} />
                      &nbsp;&nbsp;Sign Up
                    </Text> */}

                  </View>
                </>
          }


        </View>

        {isMobile &&

          <Image source={cUserName == "" ? require("../assets/avatar/avatar_player1.png") : require("../assets/avatar/avatar_player2.png")}
            style={{
              width: '100%', height: '50%',
              background: 'black',
            }}
          />
        }
      </View>

    </View >
  );
};

export default LandingScreen;


{/*
// on click of play button
<button className="decoration-button" onClick={() => {
    if (userName !== "") {
        setGameMode(0);
        navigation.navigate("GameScreen");
    }
}} >Play !</button>

// Join Server button
{serverId &&
    <button className="decoration-button" onClick={() => {
        if (userName == "") {
            window.alert("Enter UserName !");
            return;
        }

        socket.emit('message', JSON.stringify({
            cmd: 'JOIN_GAME',
            name: serverId,
            player2: userName
        }));

    }} >Join Server
    </button>}

// Create Private Room Button
<button className="decoration-button" onClick={() => {
    // Creating the room
    if (userName == "") {
        window.alert("Enter UserName !");
        return;
    }
    setOtherName("waiting...");

    socket.emit('message', JSON.stringify({
        cmd: 'CREATE_ROOM',
        player1: userName,
        map: globalMap
    }));
}}>Create Private Room</button>

 */}
