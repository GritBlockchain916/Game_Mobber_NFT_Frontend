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
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Image, Platform, Dimensions, Linking } from 'react-native';

// Personal informations
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { colors, fonts, commonStyle } from "../global/commonStyle";
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

import { Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { claimToken, getDepositAddress } from "../global/global";
import {
  getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, Token,
  getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction,
  getMint
} from '@solana/spl-token';
import { toast } from 'react-hot-toast';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
// Guide Page component
const GameRoomScreen = () => {
  const { user, setUser, setLoadingState } = React.useContext(GameContext);

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [amount, setAmount] = useState(1);
  const [deposited, setDeposited] = useState(false);
  const [serverDeposited, setServerDeposited] = useState(false);
  const [clientDeposited, setClientDeposited] = useState(false);
  const { walletProvider, connection } = useWeb3ModalProvider();
  const { address, chainId } = useWeb3ModalAccount()

  useEffect(() => {

    console.log("GameRoomScreen : ", myRoomInfo);

    if (myRoomInfo.room_state != 'opened') {
      window.alert("Room Not Created !");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    const handleSocketAmount = (data) => {
      console.log("---amount1---", data.amount);
      setAmount(data.amount);
    }

    const claimTokenHere = async () => {
      console.log("claim passive = ", myRoomInfo.amount);
      setLoadingState(true);
      await claimToken(myRoomInfo.amount, localStorage.wallet, localStorage.token);
      setLoadingState(false);
    }

    const handleSocketRoom = (data) => {


      if (data.cmd == "ROOM_CLOSED") {

        claimTokenHere();

        navigation.navigate("LandingScreen");
        window.alert("Server Room closed");
      }


      if (data.cmd == "SERVER_DEPOSITED") {
        setServerDeposited(true);
      }

      if (data.cmd == "CLIENT_DEPOSITED") {
        setClientDeposited(true);
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          client_ready: true
        }));
      }

      if (data.cmd == "TO_DEPOSIT_PAGE") {
        navigation.navigate("DepositScreen");
      }
      // setAmount(data.amount);
    }

    if (role == "server")
      setBetAmount(myRoomInfo.amount);
    else {
      console.log("---amount3---", myRoomInfo.amount);
      setAmount(myRoomInfo.amount);
    }

    socket.on('BET_AMOUNT_SET', handleSocketAmount);
    socket.on('ROOM', handleSocketRoom);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('BET_AMOUNT_SET', handleSocketAmount);
    };
  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  // Initial Variables
  const navigation = useNavigation();
  const {
    socket, gameMode, setGameMode, myRoomInfo, role, setMyRoomInfo, adminWallet
  } = React.useContext(GameContext);

  const [path, setPath] = useState("room");
  const [copied, setCopied] = useState(false);

  const reduceString = (str, len = isPC ? 40 : 38) => {
    if (str.toString().length <= len)
      return str;
    return str.slice(0, 20) + "..." + str.slice(-15);
  }

  const readFromClipboard = () => {
    // Create a temporary input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.style.position = 'absolute'; // Position it off-screen
    input.style.opacity = '0'; // Make it invisible
    input.focus();

    // Allow the user to paste into the input field
    input.select();
    document.execCommand('paste'); // This may not work in all browsers

    // Get the pasted text
    const text = input.value;
    console.log(text);

    // Clean up the input element
    document.body.removeChild(input);
  };

  const copyToClipboard = (value) => {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    document.body.removeChild(textArea);
  };

  const setBetAmount = (value) => {
    if (deposited) {
      window.alert("You already deposited");
    }
    if (role == "server") {
      console.log("---amount4---", value);
      setAmount(value);
      // socket.emit('message', JSON.stringify({
      //   cmd: 'SET_BET_AMOUNT',
      //   amount: value,
      // }));
    }
    else {
      window.alert("Only Server can set amount");
    }
  }
  const refundExit = async () => {
    // console.log("-------------refundExit----------");
    setLoadingState(true);
    let response = await claimToken(myRoomInfo.amount, localStorage.wallet, localStorage.token);

    console.log(" $$$$$$$$$$$", response);

    console.log("claim active = ", myRoomInfo.amount);

    if (role == "client") {
      socket.emit('message', JSON.stringify({
        cmd: 'CLIENT_JOIN_EXIT'
      }));
    }
    else if (role == "server") {
      socket.emit('message', JSON.stringify({
        cmd: 'CLOSE_ROOM'
      }));
    }
    setLoadingState(false);
    navigation.navigate("LandingScreen");
  }

  const depositToken = async () => {
    if (deposited) {
      window.alert("You already deposited");
      return;
    }
    if (role == 'client' && !serverDeposited) {
      window.alert("Server not yet deposit");
      return;
    }
    let response;
    try {
      response = await getDepositAddress();
    } catch (error) {
      console.error('Error fetching deposit address:', error);
      return;
    }

    const tokenAddr = response.data.data.tokenAddress;

    if (!walletProvider || !address || !connection) {
      window.alert('walletProvider or address is undefined');
      return;
    }
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
      const signature = await walletProvider.sendTransaction(tx, connection);

      console.log("deposit2--------------->", signature);
      await connection.confirmTransaction(signature, 'processed');

      console.log("deposit3--------------->", signature);
      setDeposited(true);
      socket.emit('message', JSON.stringify({
        cmd: 'TOKEN_DEPOSITED', role: role
      }));

    } catch (error) {
      console.error('Error depositng:', error);
      return;
    }


    return;
  }
  const playMobber = async () => {

    if (myRoomInfo.room_my_role == 0) {
      if (myRoomInfo.players[1].player_name != undefined &&
        myRoomInfo.players[1].player_state == 1
      ) {
        // navigation.navigate("DepositScreen");
        // if (myRoomInfo.client_ready) {
        //     socket.emit('message', JSON.stringify({
        //       cmd: 'ACTION_START_GAME', role: role
        //     }));

        // }
        // else {
        //   window.alert('Client is not ready');
        // }
        // window.alert("ACTION START GAME!!!");
        setMyRoomInfo(prevRoomInfo => ({
          ...prevRoomInfo,
          client_ready: true
        }));
        socket.emit('message', JSON.stringify({
          cmd: 'GO_TO_DEPOSIT', role: role
        }));
      }
      else {
        toast("Client not joined")
        // window.alert('Client not joined');
      }
    } else if (myRoomInfo.room_my_role == 1) {
      toast("Client has no permission to start game")
      // window.alert('client has no permission to start game');
    } else {
      toast("Someone joined in an untracked way!")

      // window.alert("Someone joined in an untracked way!");
    }
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
          paddingTop: isPC? 0 : '30px',
        }}>

          <Text style={{ color: 'white', fontSize: isPC ? '32px': '18px', fontFamily: 'Horizon', }}>Multiplayer Robby</Text>
          <Text style={{
            fontSize: isPC ? '72px' : '32px',
            color: '#FDC6D3',
            WebkitTextStroke: '1px #EF587B',
            filter: 'drop-shadow(0px 0px 20px #EF587B)',
            fontWeight: '700',
            // textShadow: '0 0 5px #fff',
            fontFamily: 'Horizon'
          }}>Waiting for player...</Text>
          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            columnGap: '10px'
          }}>
            <View style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '10px' }}>
              {(user.nfts && user.nfts.length && user.avatar >= 0) ? <img
                src={user.nfts[user.avatar].image}
                style={{ width: isPC ? '100px' : '60px', height: isPC ? '100px' : '60px', border: myRoomInfo.room_my_role == 0 ? '2px solid rgba(239, 88, 123, 1)' : '2px solid gray', borderRadius: '50%' }}
              /> :
                <Image source={
                  myRoomInfo.players[0].player_state ? require("../assets/avatar/avatar_player4.png") : require("../assets/avatar/avatar_empty.png")}
                  style={{ width: isPC ? '100px' : '60px', height: isPC ? '100px' : '60px', border: myRoomInfo.room_my_role == 0 ? '2px solid rgba(239, 88, 123, 1)' : '2px solid gray', borderRadius: '50%' }}></Image>}
              <Text style={{ fontSize: '24px', fontFamily: 'Horizon', color: 'white' }}>
                {myRoomInfo.players[0].player_state ? myRoomInfo.players[0].player_name : 'Server'}
              </Text>
            </View>
            <Text style={{ fontSize: '18px', color: 'gray', fontFamily: 'Horizon', }}>  VS </Text>
            <View style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '10px' }}>
              <Image source={
                myRoomInfo.players[1].player_state ? require("../assets/avatar/avatar_player1.png") : require("../assets/avatar/avatar_empty.png")
              }
                style={{ width: isPC ? '100px' : '60px', height: isPC ? '100px' : '60px', border: myRoomInfo.room_my_role == 0 ? '2px solid gray' : '2px solid rgba(239, 88, 123, 1)', borderRadius: '50%' }}></Image>
              <Text style={{ fontSize: '24px', fontFamily: 'Horizon', color: 'white' }}>
                {myRoomInfo.players[1].player_state ? myRoomInfo.players[1].player_name : 'Client'}
              </Text>
            </View>
          </View>

          {myRoomInfo && myRoomInfo.room_my_role == 0 &&
            < View style={{ display: 'flex', flexDirection: 'row', columnGap: '10px', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Horizon', fontSize: isPC ? '18px' : '12px', color: copied ? 'rgba(239, 88, 123, 0.8)' : colors.accent, fontWeight: '800', textDecoration: 'underline', textUnderlineOffset: '10px', cursor: 'pointer' }}
                onClick={() => {
                  copyToClipboard(myRoomInfo.room_path);
                }}>
                {reduceString(myRoomInfo.room_path)}
              </Text>
              <Image source={require("../assets/icons/copyIcon.png")}
                style={{ width: isPC ? '20px' : '14px', height: isPC ? '20px' : '14px', cursor: 'pointer' }}
                onClick={() => {
                  copyToClipboard(myRoomInfo.room_path);
                }} />

            </View>}

          {/* <Text style={{
            ...commonStyle.button,
            marginTop: '20px',
            fontFamily: 'Horizon',
          }}
            onClick={refundExit}
          >
            Refund and Exit
          </Text> */}

          <Text style={{
            ...commonStyle.button,
            marginTop: '20px',
            fontFamily: 'Horizon',
          }}
            onClick={playMobber}
          ><SimpleIcon name="energy" size={20} />
                  &nbsp;&nbsp;
            Play Mobber!
          </Text>

          {isMobile &&
            <Image source={require("../assets/avatar/avatar_player4.png")}
              style={{
                width: '100%', height: '50%',
                marginLeft: 'auto'
              }}
            />}
        </View>
      </View>

    </View >
  );
};

export default GameRoomScreen;


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
