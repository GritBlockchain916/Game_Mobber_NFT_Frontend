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
import { View, Text, TextInput, Image, Platform, Dimensions, Linking, Switch, ScrollView, Animated } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import GameContext from '../context/GameContext';
import Icon from 'react-native-vector-icons/Ionicons';
// Personal informations
import HeaderScreen from "./HeaderScreen";

import { colors, commonStyle, fonts } from '../global/commonStyle';
import { getScoreList, getUserInfo } from '../global/global';
// Guide Page component
const LeaderboardScreen = () => {

  /* ================================ For Mobile Responsive ===============================*/
  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [top10, setTop10] = useState(true);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  // const [userInfo, setUserInfo] = useState({});
  
  const {
    userInfo,
    setUserInfo,
    setLoadingState,
  } = React.useContext(GameContext);
  const getScoreInfo = async () => {
    setLoadingState(true);
    let response = await getScoreList(top10?"top10":"global", top10?10:20, 0);
    // console.log("response ============> ", response)
    console.log("recoe = ", response.data.code);
    if (response.data.code == "00") {
      console.log(response.data.data);
      const height1 = parseInt(response.data.data.length) * 52;
      setContentHeight(height1)
      // setContentHeight(parseInt(response.data.data.length) * 62)
      setData(response.data.data);
      setLoadingState(false)
    }
  }
  
  useEffect(() => {
    getScoreInfo();
    // if(localStorage.token) getUserInfo(localStorage.token).then(response => {
    //   if(response.data.code == "00"){
    //     setUserInfo(response.data.data)
    //   }
    // });
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, [top10]);
  /* ================================ For Mobile Responsive ===============================*/
  // Initial Variables
  const navigation = useNavigation();

  const [path, setPath] = useState("leaderboard");

  const [data, setData] = useState([]);
  const [isHovered, setIsHovered] = useState(null)
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [contentHeight, setContentHeight] = useState(620);
    // Assume the total scrollable content height
  const windowHeight = isPC ? Dimensions.get('window').height - 400 : Dimensions.get("window").height - 285;
  
  const getRankStyle = (rank, player) => {
    if (rank == 1) {
      return { color: player.id == userInfo.id ? 'white' : 'black', background: '#F3B34C', borderRadius: '50%', border: player.id == userInfo.id ? 0: '2px solid #F6D65D' }
    } else if (rank == 2) {
      return { color: player.id == userInfo.id ? 'white' : 'black', background: '#BEBEBE', borderRadius: '50%', border: player.id == userInfo.id ? 0 :'2px solid #E6E6E6' }
    } else if (rank == 3) {
      return { color: player.id == userInfo.id ? 'white' : 'black', background: 'rgba(200, 139, 76, 1)', borderRadius: '50%', border: player.id == userInfo.id ? 0: '2px solid #E9B06D' }
    }
    return { background: 'black', borderRadius: '50%', border: '2px solid white' }
  }

  // Receiving events from the server
  
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      fontFamily: fonts.fantasy,
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
            borderRight: commonStyle.border,
          }}>
            <Image source={require("../assets/avatar/avatar_player3.png")}
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
          height: '100%',
          textAlign: 'center',
          alignItems: 'center',
          background: 'black',
          justifyContent: 'space-between'
        }}>
          <View style={{
            width: '100%',
            height: isPC ? '300px' : '185px',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: commonStyle.border,
          }}>
            <Text style={{ color: 'white', fontSize: '20px', fontFamily: 'Horizon' }}>Top Mobbers</Text>
            <Text style={{
              fontSize: isPC ? '96px' : '64px',
              color: '#FDC6D3',
              WebkitTextStroke: '1px #EF587B',
              filter: 'drop-shadow(0px 0px 20px #EF587B)',
              fontWeight: '700',
              // textShadow: '0 0 5px #fff',
              fontFamily: 'Horizon'
            }}>Leaderboard</Text>
            <View style={{
              display: 'flex', flexDirection: 'row',
              marginTop: '30px', alignItems: 'center',
              columnGap: '10px'
            }}>
              <Text style={{
                color: top10 ? 'white' : 'gray',
                fontFamily: 'Horizon',
                fontSize: '16px'
              }}>
                Top 10 only
              </Text>
              <SwitchToggle
                switchOn={!top10}
                onPress={() => { 
                  // getScoreList(top10?"top10":"global", 10, 0).then(res => {

                  // })
                  setTop10(!top10)
                }}
                circleColorOff="#FFFFFF"
                circleColorOn="#FFFFFF"
                backgroundColorOn="#EF587B"
                backgroundColorOff="#5CE1E6"
                containerStyle={{
                  width: 51,
                  height: 31,
                  borderRadius: 25,
                  padding: 2,
                }}
                circleStyle={{
                  width: 27,
                  height: 27,
                  borderRadius: 15,
                }}
              />
              <Text style={{
                color: !top10 ? 'white' : 'gray',
                fontFamily: 'Horizon',
                fontSize: '16px'
              }}>
                Global Players
              </Text>
            </View>
          </View>
          <ScrollView
            style={{
              width: isPC ? '50vw' : '100%',
              height: '600px',
              flex: 1,
            }}
            contentContainerStyle={{
              // paddingRight: 10,
              paddingRight: contentHeight > windowHeight ? 9 : 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            bounces={true} // Enable bouncing effect on iOS
            overScrollMode="always" // Enable overscroll effect on Android
            showsVerticalScrollIndicator={false}
            onScroll={ Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {data.map((player, index) => {
              return (<View style={[{
                display: 'flex', flexDirection: 'row',
                alignItems: 'center',
                width: '100%', justifyContent: 'space-between',
                padding: '10px',
                border: userInfo.id==player.id?"1px solid #EF587B":commonStyle.border,
                backgroundColor: userInfo.id==player.id ? '#FDC6D3' : ""
              }, isHovered == index && {backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} onMouseEnter={() => {setIsHovered(index)}} onMouseLeave={() => setIsHovered(null)}>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '20px',
                  alignItems: 'center',
                  width: '80px'
                }}>
                <Text style={{
                  color: 'white', fontSize: '20px',
                  width: '30px',
                  height: '30px',
                  alignContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Horizon',
                  borderRadius: '50px',
                  backgroundColor: userInfo.id==player.id ?"#EF587B":"",
                  ...getRankStyle(index + 1, player)
                }}>{index + 1}</Text>
                  {userInfo.id == player.id && 
                  <Text style={{ cursor: 'pointer', color: "#ef587b", fontSize: '20px', fontFamily: 'Horizon',}} onClick={() => { console.log(`https://twitter.com/intent/tweet?text=${localStorage.twitterMag}:Score=${player.scores}`)}}>
                     {/* location.href = `https://twitter.com/intent/tweet?text=${localStorage.twitterMag}.":".${player.scores}` }}> */}
                    <Icon name="share-social" size={25}/>
                  </Text>}
                </View>
                
                <Text style={{ color: userInfo.id==player.id ? "#ef587b":  'white', fontSize: '20px', fontFamily: 'Horizon',}}>{player.name}</Text>
                <View style={{ width: '80px', display: 'flex', justifyContent: 'end', flexDirection: 'row'}}>
                  <Text style={{ width:"40px", color: userInfo.id==player.id ? "#ef587b": 'white', fontSize: '20px', fontFamily: 'Horizon',textAlign: 'right'}}>{player.scores}</Text>
                </View>
              </View>);
            })}
          </ScrollView>

          {contentHeight > windowHeight && <Animated.View
            style={[
              {
                position: 'absolute',
                top: isPC ? 300: 185,
                right: 2,
                width: 5,
                backgroundColor: '#ef587b',
                borderRadius: 3,
              },
              {
                height: parseFloat(windowHeight) / (parseFloat(contentHeight) / parseFloat(windowHeight)), // Set indicator height based on content height
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, Math.abs(contentHeight - windowHeight)],
                      outputRange: [0, Math.abs(windowHeight - windowHeight / (contentHeight / windowHeight))],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />}
        </View>
      </View>

    </View >
  );
};

export default LeaderboardScreen;


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
