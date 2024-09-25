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
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Image, Platform, Dimensions, Linking } from 'react-native';
import { globalMap } from "../global/globalMap";
import { sendAndConfirmVersionedTransactions, socket, sendAndConfirmLegacyTransactions } from '../global/global';
// Personal informations
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { colors, fonts, commonStyle } from "../global/commonStyle";
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

import { Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { getDepositAddress } from "../global/global";
import {
  getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, Token,
  getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction,
  getMint
} from '@solana/spl-token';
import toast from 'react-hot-toast';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// Guide Page component
const DepositScreen = () => {
  const { user, setUser, otherCharacter, setOtherCharacter } = React.useContext(GameContext);

  /* ================================ For Mobile Responsive ===============================*/
  const [path, setPath] = useState("room");
  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [amount, setAmount] = useState(100);
  const [serverId, setServerId] = useState('');
  const [amountApplied, setAmountApplied] = useState(false);
  const [otherDespositFlag, setOtherDepositFlag] = useState(false);
  const [depositFlag, setDepositFlag] = useState(false);
  const [chatText, setChatText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { walletProvider, connection } = useWeb3ModalProvider();
  const { address, chainId } = useWeb3ModalAccount();
  const inputRef = useRef(null);

  useEffect(() => {
    // setAmountApplied(false);
    // setDepositFlag(false);
    // setOtherDepositFlag(false);
    console.log("--------------amount--3-3---", myRoomInfo.amount);

    Linking.getInitialURL().then(url => {
      if (url) {
        const _serverId = url.split('/?')[1];
        console.log("server id : ", _serverId);
        if (_serverId) {
          setServerId(_serverId);
          socket.emit('message', JSON.stringify({
            cmd: 'GET_AMOUNT',
            name: _serverId,
          }));
        }
        // setRoomPath(FRONTEND_URL + "/?" + _serverId);
      }
    }).catch(err => console.error('An error occurred', err));


    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    const handleSocketRoom = (data) => {
      console.log("handleSocketRoom depositscreen:", data);
      if (data.cmd === "RETURN_AMOUNT") {
        setAmount(data.serverAmount);
      }
      if (data.cmd === "SET_BET_AMOUNT") {
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          amount: data.amount,
          // client_ready: true,
        }));
        setAmount(data.amount);
        // setAmountApplied(true);
        // setMyRoomInfo(prevRoomInfo => ({
        //   ...prevRoomInfo,
        //   amount: amount,
        //   // client_ready: true,
        // }));
      }
      if (data.cmd === "OTHER_DEPOSITED") {
        console.log("$$$$$$$$$$$$other= ", data.otherCharacter);
        // setOtherDepositFlag(true);
        if (role == "server") {
          setMyRoomInfo(prevRoomInfo => ({
            ...prevRoomInfo,
            deposit2: true,
            // client_ready: true,
          }));
          setOtherCharacter(data.otherCharacter)
        }
        else {
          setMyRoomInfo(prevRoomInfo => ({
            ...prevRoomInfo,
            deposit1: true,
            // client_ready: true,
          }));
          setOtherCharacter(data.otherCharacter)
        }

      }
      if (data.cmd === "CHAT_TEXT") {
        if (role == "server")
          // toast(myRoomInfo.players[1].player_name + ": " + data.text, { duration: 10000, background: "#df0707" })
          toast(myRoomInfo.players[1].player_name + ": " + data.text,
            {
              style: {
                duration: 12000,
                borderRadius: '10px',
                fontSize: '18px',
                background: '#555',
                color: '#fff',
              },
            }
          );
        else
          toast(myRoomInfo.players[0].player_name + ": " + data.text,
            {
              style: {
                duration: 12000,
                borderRadius: '10px',
                fontSize: '18px',
                background: '#555',
                color: '#fff',
              },
            }
          );
        // toast(myRoomInfo.players[0].player_name + ": " + data.text, { duration: 10000, background: "#df0707" })
      }
      if (data.cmd == "CLIENT_PLAY_AGAIN_APPROVED") {
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          client_ready: true
        }));
      }
    };

    socket.on('ROOM', handleSocketRoom);
    window.addEventListener('resize', handleResize);
    return () => {
      socket.off('ROOM', handleSocketRoom);
      window.removeEventListener('resize', handleResize);
    };


  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  // Initial Variables
  const navigation = useNavigation();
  const {
    socket, gameMode, setGameMode, myRoomInfo, role, setMyRoomInfo, adminWallet, userInfo, setLoadingState, character
  } = React.useContext(GameContext);

  const setBetAmount = (value) => {

    console.log("serverId============", serverId);
    if (serverId) {
      toast("Client can't select the amount of token");
      return;
    }
    if (myRoomInfo.amount != 0) {
      toast("Deposit token amount already applied");
      return;
    }
    // setMyRoomInfo(prevRoomInfo => ({
    //   ...prevRoomInfo,
    //   amount: value,
    //   // client_ready: true,
    // }));
    setAmount(value);

  }

  const sendChatText = () => {
    if (chatText != "") {
      toast("me:" + chatText,
        {
          style: {
            duration: 12000,
            borderRadius: '10px',
            background: '#333',
            
            fontSize: '18px',
            color: '#fff',
            fontSize: '18px'
          },
        }
      );
      // toast("me:"+ chatText, { duration: 12000});

      socket.emit('message', JSON.stringify({
        cmd: 'CHAT_TEXT',
        text: chatText,
        role: role
      }));
      setChatText("");
    }
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  }

  const applyAmount = () => {
    if (myRoomInfo.client_ready != true) {
      toast.error(myRoomInfo.players[1].player_name + " is not ready!");
      return;
    }
    if (amount == 0) {
      toast.error("Select token amount first");
      return;
    }
    socket.emit('message', JSON.stringify({
      cmd: 'SET_BET_AMOUNT',
      amount: amount,
    }));
    setMyRoomInfo(prevRoomInfo => ({
      ...prevRoomInfo,
      amount: amount,
      // client_ready: true,
    }));
    // setAmountApplied(true);
  }
  const playMobber = async () => {

    if (myRoomInfo.room_my_role == 0) {
      if (myRoomInfo.players[1].player_name != undefined &&
        myRoomInfo.players[1].player_state == 1
      ) {
        // navigation.navigate("DepositScreen");
        if (myRoomInfo.deposit1 && myRoomInfo.deposit2) {
          socket.emit('message', JSON.stringify({
            cmd: 'ACTION_START_GAME', role: role
          }));
          setMyRoomInfo(prevRoomInfo => ({
            ...prevRoomInfo,
            client_ready: false
          }));
        }
        else {
          toast('Both have to deposit to start');
          return;
        }
        // toast("ACTION START GAME!!!");
        // socket.emit('message', JSON.stringify({
        //   cmd: 'GO_TO_DEPOSIT', role: role
        // }));
      }
      else {
        toast("Client not joined")
        return
        // window.alert('Client not joined');
      }
    } else if (myRoomInfo.room_my_role == 1) {
      toast("Client has no permission to start game")
      return;
      // window.alert('client has no permission to start game');
    } else {
      toast("Someone joined in an untracked way!")

      // window.alert("Someone joined in an untracked way!");
    }
  }
  const depositToken = async () => {

    let response;
    try {
      response = await getDepositAddress();
    } catch (error) {
      console.error('Error fetching deposit address:', error);
      return;
    }

    const tokenAddr = response.data.data.tokenAddress;

    if (!walletProvider || !address || !connection) {
      toast('Import wallet');
      return;
    }

    if (myRoomInfo.amount == 0) {
      if (role == "server")
        toast("Apply token amount first");
      else
        toast("Wait for Server select amount of token");
      return;
    }

    if (role == "server") {
      if (myRoomInfo.deposit1) {
        toast("You already deposited");
        return;
      }
    }
    else {
      if (myRoomInfo.deposit2) {
        toast("You already deposited");
        return;
      }
    }

    setLoadingState(true);
    try {
      const myAddr = address; // The address of the user
      const adminWalletAddr = response.data.data.depositAddress; // Admin address

      const sender = new PublicKey(myAddr); // User's public key
      const receiver = new PublicKey(adminWalletAddr); // Admin's public key
      const mint = new PublicKey(tokenAddr); // Token mint address

      const fromATA = getAssociatedTokenAddressSync(mint, sender);
      const toATA = getAssociatedTokenAddressSync(mint, receiver);

      let instructions = [];
      const info = await connection.getAccountInfo(toATA);
      if (!info) {
        instructions.push(createAssociatedTokenAccountInstruction(sender, toATA, receiver, mint));
      }
      const tokenMint = await getMint(connection, mint);
      instructions.push(createTransferInstruction(fromATA, toATA, sender, amount * 10 ** tokenMint.decimals));

      const tx = new Transaction().add(...instructions);
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = sender;
      console.log("deposit1--------------->");
      const signature = await walletProvider.sendTransaction(tx, connection);//Here token send

      // console.log("deposit2--------------->", signature);
      // await connection.confirmTransaction(signature, 'processed');

      // console.log("deposit3--------------->", signature);
      // let res = await sendAndConfirmVersionedTransactions(connection, tx);
      // console.log("res = ", res);
      socket.emit('message', JSON.stringify({
        cmd: 'TOKEN_DEPOSITED', role: role, otherCharacter: character,
      }));
      if (role == "server") {
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          deposit1: true,
        }));

      }
      else {
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          deposit2: true,
        }));
      }

      // console.log("^^^^^^^^^^^^^^", userInfo);
      // if (serverId) {     // JOIN TO THE OTHER SERVER SPECIFIED IN THE SERVER ID
      //   socket.emit('message', JSON.stringify({
      //     cmd: 'ACTION_JOIN_GAME',
      //     name: serverId.toString(),
      //     player2: userInfo.username,
      //   }));
      // } else {
      //   setMyRoomInfo(prevRoomInfo => ({
      //     ...prevRoomInfo,
      //     amount: amount,
      //     client_ready: true,
      //   }));
      //   socket.emit('message', JSON.stringify({
      //     cmd: 'ACTION_CREATE_ROOM',
      //     player1: userInfo.username,
      //     map: globalMap,
      //     amount: amount
      //   }));
      // }

    } catch (error) {
      console.error('Error depositng:', error);
      toast.error('Error depositng:', error);
      setLoadingState(false);
      return;
    }

    setLoadingState(false);

    return;
  }
  // Receiving events from the server

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      fontFamily: fonts.fantasy
    }}>
      <HeaderScreen path={path}></HeaderScreen>

      <View style={{
        position: 'relative',
        height: 'calc(100vh - 100px)',
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
            <Image source={require("../assets/avatar/avatar_player4.png")}
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
          width: isPC ? '50%' : '100%',
          height: '100%',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
          rowGap: isPC ? '20px' : '10px',
        }}>

          <Text style={{ color: 'white', fontSize: '24px', fontFamily: 'Horizon', }}>Multiplayer Robby</Text>
          <Text style={{
            fontSize: isPC ? '96px' : '64px',
            color: '#FDC6D3',
            WebkitTextStroke: '1px #EF587B',
            filter: 'drop-shadow(0px 0px 20px #EF587B)',
            fontWeight: '700',
            // textShadow: '0 0 5px #fff',
            fontFamily: 'Horizon'
          }}>Deposit Tokens</Text>

          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            columnGap: '10px'
          }}>


            {/* </View>
          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            columnGap: '10px'
          }}> */}
            <Text style={{
              ...amount == 100 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(100)
              }
              }
            >100</Text>
            <Text style={{
              ...amount == 200 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(200)
              }
              }
            >200</Text>

            <Text style={{
              ...amount == 500 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(500)
              }
              }
            >500</Text>
            <Text style={{
              ...amount == 1000 ? commonStyle.toggleBtn1 : commonStyle.toggleBtn2,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={() => {
                setBetAmount(1000)
              }
              }
            >1000</Text>
          </View>
          {role == "server" && myRoomInfo.amount == 0 && <Text style={{
            ...commonStyle.button,
            marginTop: '20px',
            fontFamily: 'Horizon',
          }}
            onClick={applyAmount}
          >
            Apply
          </Text>
          }

          {myRoomInfo.amount != 0 &&
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: '10px',
            }}>
              <Text style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '900',
                color: 'white',
                fontFamily: 'Horizon'
              }}>
                Player1: &nbsp;
                <Text style={{ color: myRoomInfo.deposit1 ? colors.agreeSafe : colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{myRoomInfo.deposit1 ? "Yes" : "No"}</Text>
              </Text>
              <Text style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '900',
                color: 'white',
                fontFamily: 'Horizon'
              }}>
                Player2: &nbsp;
                <Text style={{ color: myRoomInfo.deposit2 ? colors.agreeSafe : colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{myRoomInfo.deposit2 ? "Yes" : "No"}</Text>
              </Text>
            </View>}
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: '10px',
          }}>
            <Text style={{
              ...commonStyle.button,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={depositToken}
            >
              <SimpleIcon name="diamond" size={20} />
              &nbsp;&nbsp;
              Deposit
            </Text>
            <Text style={{
              ...commonStyle.button,
              marginTop: '20px',
              fontFamily: 'Horizon',
            }}
              onClick={playMobber}
            >
              <SimpleIcon name="energy" size={20} />
              &nbsp;&nbsp;
              Play Mobber!!!
            </Text></View>

          {isMobile &&
            <Image source={require("../assets/avatar/avatar_player4.png")}
              style={{
                width: '100%', height: '50%',
                marginLeft: 'auto'
              }}
            />}
        </View>
        <View style={{
          position: 'absolute', // Set position to absolute
          bottom: 0, // Align the container to the bottom of the screen
          right: 0, // Stretch it to the right edge
          padding: '10px', // Optional padding around the content
          width: isPC ? '50%' : '100%',
          backgroundColor: 'transparent', // Adjust background if needed
        }}>
          <View
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: '10px',
              backgroundColor: isHovered ? '#505357' : '#383a40', // Change color on hover
              borderRadius: '10px',
            }}>
            <Image
              source={require("../assets/avatar/avatar_player4.png")}
              style={{
                width: isPC ? '40px' : '40px',
                height: isPC ? '40px' : '40px',
                border: '2px solid rgba(239, 88, 123, 1)',
                backgroundColor: 'black',
                borderRadius: '50%',
                marginLeft: "6px"
              }}
            />
            <TextInput
              ref={inputRef}
              style={{
                flex: 1, // Takes the remaining space
                padding: '0.5rem',
                borderRadius: '30px',
                background: 'transparent',
                fontSize: '16px',
                lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
                // border: '1px solid gray', // You can uncomment the border or customize it
                outline: 'none'
              }}
              type="text"
              placeholder="Message to other player..."
              value={chatText}
              onChange={(e) => {
                setChatText(e?.target?.value);
              }}
              onSubmitEditing={(e) => {
                sendChatText();
                e.preventDefault(); // Prevent default behavior
              }}
            />
            <Text
              style={{
                ...commonStyle.button2,
                fontFamily: 'Horizon',
                marginRight: '6px',
                padding: '5px 10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '5px',
                paddingBottom: '5px'

              }}
              onClick={sendChatText}
            >
              <SimpleIcon name="cursor" size={15} />
              &nbsp;
              Send
            </Text>
          </View>
        </View>
      </View>
    </View >
  );
};

export default DepositScreen;


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
