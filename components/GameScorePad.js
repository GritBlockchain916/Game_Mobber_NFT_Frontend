import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Platform, View, Dimensions, Image } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import GameContext from '../context/GameContext';
import { fonts } from '../global/commonStyle';
import { cashRate } from '../src/GameSettings';
import axios from 'axios';
import { getUserInfo } from '../global/global';

function generateTextShadow(width) {
  return Platform.select({
    web: {
      textShadow: `-${width}px 0px 0px #000, ${width}px 0px 0px #000, 0px -${width}px 0px #000, 0px ${width}px 0px #000`
    }, default: {}
  });
}
const textShadow = generateTextShadow(4);
const textShadowHighscore = generateTextShadow(2);

export default function ScorePad({ gameOver, score,rate, ...props }) {
  const { gameMode, setGameMode, character, role,myRoomInfo, setMyRoomInfo, } = React.useContext(GameContext);
  const [highscore, setHighscore] = useState(0);

  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);

  const getUserTopSorce = async () => {
    let response = await getUserInfo(localStorage.token);
    setHighscore(response.data.data.score);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };
    getUserTopSorce();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  React.useEffect(() => {
    if (gameOver) {
      if (score > highscore) {
        setHighscore(score);
      }
    }
  }, [gameOver])


  const { top, left } = useSafeArea();

  return (
    <View style={{
      position: 'absolute', left: '0px', bottom: '0px', background: 'black', zIndex: '5000',
      width: gameMode==0 ? (isPC?'300px' : '250px'):(isPC?"150px":"125px"), height: isPC ? '150px' : '125px',
      display: 'flex', flexDirection: 'row',
      borderTopRightRadius: '50px', border: '2px solid gray',
    }}>
      <View style={{
        width: gameMode==0?'50%':"100%", display: 'flex', flexDirection: 'column', borderRight: gameMode==0?'2px solid gray':"",
        alignItems: 'center',
        textAlign: 'center',
        // rowGap: '10px',
        justifyContent: 'center'
      }}>
        <Text style={{
              fontSize: isPC ? '96px' : '64px',
              color: '#FDC6D3',
              WebkitTextStroke: '1px #EF587B',
              filter: 'drop-shadow(0px 0px 20px #EF587B)',
              fontWeight: '700',
              // textShadow: '0 0 5px #fff',
              fontFamily: 'Horizon'

        }}>{score}</Text>
        {gameMode==0&&
        <Text style={{
          fontSize: '20px',
          fontFamily: 'Horizon',
          color: 'white',

        }}>Top {highscore}</Text>}
      </View>
      {gameMode==0&&
      <View style={{
        width: '50%', alignItems: 'center',
        display: 'flex', flexDirection: 'row',
        columnGap: '10px', justifyContent: 'center',
      }}>
        <Image source={require("../assets/images/ScoreCoin.png")}
          style={{ width: '30%', height: '50%' }}
        />
        <Text style={{ color: 'yellow', fontSize: isPC ? '24px' : '20px', fontFamily: fonts.fantasy }}>x {rate!=NaN?(score * rate<10?(score * rate).toFixed(3):(score * rate).toFixed(1)):0}</Text>
      </View>
}
    </View >
    // <View pointerEvents="none" style={[styles.container, { top: Math.max(top, 16), left: Math.max(left, 8) }]}>
    //   <Text style={[styles.score, textShadow]}>{score}</Text>
    //   {highscore > 0 && (<Text style={[styles.highscore, textShadowHighscore]}>TOP {highscore}</Text>)}
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },

  score: {
    color: 'white',
    fontFamily: 'retro',
    fontSize: 48,
    backgroundColor: 'transparent',
  },
  highscore: {
    color: 'yellow',
    fontFamily: 'retro',
    fontSize: 14,
    marginTop: 4,
    letterSpacing: -0.1,
    backgroundColor: 'transparent',
  }
})
