import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { Image, Dimensions, Text, Alert, Animated, Easing, StyleSheet, View, InteractionManager } from "react-native";

import GameContext from "../context/GameContext";
import { fonts, spinnerStyle } from '../global/commonStyle';
import { useNavigation } from "@react-navigation/native";
import { commonStyle } from "../global/commonStyle";
import { colors } from "../global/commonStyle";
import { socket, claimToken } from '../global/global';
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'

import { Connection, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { getDepositAddress } from "../global/global";
import {
  getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, Token,
  getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction,
  getMint
} from '@solana/spl-token';
import Icon from 'react-native-vector-icons/Ionicons';
import { FaSpinner } from 'react-icons/fa';
function GameOver({ ...props }) {
  const { gameMode, setGameMode, character, role, myRoomInfo, setMyRoomInfo, setLoadingState, userInfo } = React.useContext(GameContext);
  const navigation = useNavigation();
  console.log("Game over ==========", userInfo.username)
  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [pvpEndFlag, setPvpEndflag] = useState(false);
  const [resultString, setResultString] = useState("");
  const [otherScore, setOtherScore] = useState(0);
  const [rewardable, setrewardable] = useState(false);
  const [p2eRewardable, setpe2Rewardable] = useState(true);
  const [rewardLoading, setRewardLoading] = useState(false);

  const { walletProvider, connection } = useWeb3ModalProvider();
  const { address, chainId } = useWeb3ModalAccount()
  const {
    // set the socket to the context
    setSocket,
  } = React.useContext(GameContext);
  useEffect(() => {

    InteractionManager.runAfterInteractions((_) => {
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 1,
        duration: 800,
        delay: 0,
        easing: Easing.in(Easing.qubic),
      }).start();
    });
    console.log("GameRoomScreen on over screen : ", myRoomInfo);
    if (role == "server") {
      setMyRoomInfo(prevRoomInfo => ({
        ...prevRoomInfo,
        client_ready: false
      }));

    }
    setSocket(socket);
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };

    const handleSocketRoom = (data) => {
      // console.log("handleSocketRoom = ", data);
      console.log("--data:", data);
      if (data.cmd === "MATCH_RESULT") {
        if (role == "server") {
          setOtherScore(data.score2);
          if (data.score1 > data.score2) {
            setResultString("You Won");
            setrewardable(true);
          }
          else if (data.score1 < data.score2) {
            setResultString("You Lost");
          }
          else {
            setResultString("Drawed");
            setrewardable(true);
          }
        }
        if (role == "client") {
          setOtherScore(data.score1);
          if (data.score1 < data.score2) {
            setResultString("You Won");
            setrewardable(true);
          }
          else if (data.score1 > data.score2) {
            setResultString("You Lost");
          }
          else {
            setResultString("Drawed");
            setrewardable(true);
          }
        }
        setPvpEndflag(true);
      }
    }

    window.addEventListener('resize', handleResize);
    socket.on('ROOM', handleSocketRoom);
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('ROOM', handleSocketRoom);
    };



  }, []);

  /* ================================ For Mobile Responsive ===============================*/
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
      window.alert('walletProvider or address is undefined');
      return;
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
      instructions.push(createTransferInstruction(fromATA, toATA, sender, myRoomInfo.amount * 10 ** tokenMint.decimals));

      const tx = new Transaction().add(...instructions);
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = sender;
      console.log("deposit1--------------->");
      // const signature = await walletProvider.sendTransaction(tx, connection);//Here token send

      // console.log("deposit2--------------->", signature);
      // await connection.confirmTransaction(signature, 'processed');

      // console.log("deposit3--------------->", signature);
      // let res = await sendAndConfirmVersionedTransactions(connection, tx);
      // console.log("res = ", res);
      // socket.emit('message', JSON.stringify({
      //   cmd: 'TOKEN_DEPOSITED', role: role
      // }));


    } catch (error) {
      console.error('Error depositng:', error);
      setLoadingState(false);
      return;
    }

    setLoadingState(false);

    return;
  }
  const getReward = async () => {
    // setLoadingState(true);
    // console.log("gameeMode = ", gameMode);
    if (rewardLoading) {
      return;
    }
    setRewardLoading(true);
    if (gameMode == 0) {
      
      // console.log("amou111");
      await claimToken(props.score, localStorage.wallet, 0, localStorage.token);
      setpe2Rewardable(false);

    }
    else {
      // console.log("amou112");
      if (resultString == "Drawed")
        await claimToken(myRoomInfo.amount * 2, localStorage.wallet, 2, localStorage.token);
      else
        await claimToken(myRoomInfo.amount, localStorage.wallet, 2, localStorage.token);

      setrewardable(false);
    }
    setRewardLoading(false);
  }
  const restartGame = async () => {
    if (rewardLoading)
      return;
    if (gameMode == 2) {
      //     await depositToken();
      if (role == "client") {
        socket.emit('message', JSON.stringify({
          cmd: 'CLIENT_PLAY_AGAIN',
        }));
      }
      setMyRoomInfo(prevRoomInfo => ({
        ...prevRoomInfo,
        deposit1: false,
        deposit2: false,
        otherOver: false,
        amount: 0
      }));
      navigation.navigate("DepositScreen");
    }
    props.setGameState('none');
    // setGameMode(0);
    // navigation.navigate("GameScreen");

    // props.navigation.goBack();
    // props.onRestart();
    // props.setGameState(true);
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;

  return (
    <Animated.View style={{
      background: 'black',
      width: isPC ? '600px' : '350px',
      height: isPC ? '394px' : '272px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      rowGap: '20px',
      paddingTop: '10px',
      // paddingBottom: '10px',
      resizeMode: "contain",
      border: '2px solid gray',
      borderRadius: '20px',
      opacity: fadeAnim
    }}>
      <View
        style={{ position: 'absolute', top: 20, right: 20, color: 'white', cursor: 'pointer' }}
        onClick={() => { location.href = `https://twitter.com/intent/tweet?text=${localStorage.twitterMag}.":".${userInfo.username}` }}
      >
        <Icon name="share-social" size={30} style={{ color: 'white' }} />
      </View>
      <Text style={{
        fontSize: isPC ? '96px' : '64px',
        color: '#FDC6D3',
        WebkitTextStroke: '1px #EF587B',
        filter: 'drop-shadow(0px 0px 20px #EF587B)',
        fontWeight: '700',
        // textShadow: '0 0 5px #fff',
        fontFamily: 'Horizon'
      }}>
        {!pvpEndFlag || gameMode == 0 ? "GAME OVER" : resultString}
      </Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: '5px',
      }}>
        <Text style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '900',
          color: 'white',
          fontFamily: 'Horizon'
        }}>
          Your score: &nbsp;
          <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{props.score}</Text>

        </Text>
        {pvpEndFlag && <Text style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '900',
          color: 'white',
          fontFamily: 'Horizon'
        }}>
          Other score: &nbsp;
          <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{otherScore}</Text>
        </Text>}
      </View>
      {gameMode == 2 && resultString == "You Won" && pvpEndFlag &&
        <Text style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '900',
          color: 'white',
          fontFamily: 'Horizon'
        }}>
          Your Reward: &nbsp;
          <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{myRoomInfo.amount * 2*0.75}</Text>
          &nbsp;Cash Tokens
        </Text>
      }
      {gameMode == 2 && resultString == "Drawed" && pvpEndFlag &&
        <Text style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '900',
          color: 'white',
          fontFamily: 'Horizon'
        }}>
          Your Reward: &nbsp;
          <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{myRoomInfo.amount *0.75}</Text>
          &nbsp;Cash Tokens
        </Text>
      }
      {gameMode == 0 &&
        <Text style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '900',
          color: 'white',
          fontFamily: 'Horizon'
        }}>
          Your Reward: &nbsp;
          <Text style={{ color: colors.accent, fontFamily: 'Horizon', fontSize: "32px" }}>{(parseFloat(props.score) * parseFloat(localStorage.rate)) < 10 ?
            (parseFloat(props.score) * parseFloat(localStorage.rate)).toFixed(3) : (parseFloat(props.score) * parseFloat(localStorage.rate)).toFixed(2)}</Text>
          &nbsp;Cash Tokens
        </Text>
      }
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: '10px',
      }}>
        {(rewardable || (p2eRewardable && gameMode == "0")) &&
          <Text style={{
            ...commonStyle.button,
            fontFamily: fonts.fantasy,
            // marginTop: '25px',
            marginBottom: '10px',
            fontFamily: 'Horizon',
          }}
            onClick={() => getReward()}
          >
            {rewardLoading ? (
              <div style={spinnerStyle} />
            ) : null}
            {rewardLoading ? 'Processing...' : 'Get Reward'}
          </Text>
        }
        {pvpEndFlag || gameMode == 0 ? <Text style={{
          ...commonStyle.button,
          fontFamily: fonts.fantasy,
          // marginTop: '25px',
          marginBottom: '10px',
          fontFamily: 'Horizon',
        }}
          onClick={restartGame}
        >
          {rewardLoading ? (
              <div style={spinnerStyle} />
            ) : null}
            
          Play Again
        </Text> : <Text style={{
          textAlign: 'center',
          fontSize: '30px',
          fontWeight: '900',
          color: 'red',
          fontFamily: 'Horizon'
        }}>
          Wait Other!!!
        </Text>}
      </View>
    </Animated.View>

  );
}

export default GameOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
