import { View, StyleSheet, Text, TextInput, Image, Platform, Dimensions, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';

import { fonts } from '../global/commonStyle';
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { deepCopy } from '../global/common';
import { getCharacters, getUserInfo, setMyNFT } from '../global/global';
import toast from 'react-hot-toast';

export default function NFTScreen({ openNFT, setOpenNFT }) {
  /* ================================ For Mobile Responsive ===============================*/
  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [characters, setCharacters] = useState([])
  useEffect(() => {
    getUserInfo(localStorage.token).then(response => {
      if(response.data.code == "00"){
        if(response?.data?.data?.character?.name)
          setCharacter(response.data.data.character.name)
      }else {
        toast.error("Please log in!")
      }
    })
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };
    getCharacters().then(response => {
      if(response.data.code == "00"){
        if(Array.isArray(response?.data?.data))
          setCharacters(response.data.data)
      }else {
        toast.error("No characters!")
      }
    })
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  /* ================================ For Mobile Responsive ===============================*/
  // Initial Variables
  const navigation = useNavigation();
  const [path, setPath] = useState("nft");

  const { user, setUser,
    setLoadingState,
    character,
    setCharacter
  } = React.useContext(GameContext);

  const renderAvatar = ({ item, index }) => (
    <View style={{
      padding: '10px',
      width: isPC ? '30%' : '80%',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
      background: 'rgba(0,0,255,0.1)',
      border: index == user.avatar ? '1px solid gray' : 'none',
      borderRadius: '10px'
    }} onClick={() => {
      const new_user = deepCopy(user);
      new_user.avatar = index;
      new_user.collection = new_user.nfts[index].collection
      setUser(new_user);
      setMyNFT(new_user.collection).then(response => {
        if(response.data.code == "00"){
          if(response?.data?.data?.character?.name){
            setCharacter(response.data.data.character.name)
            toast.success(
              `Selected character: ${response?.data?.data?.character?.name}`, 
              { 
                style: {
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '5px 5px 10px 3px rgba(210, 0, 0, 0.7)',
                  borderRadius: '10px',
                  fontWeight: 400
                }
              }
            )
          }
        }
      }).catch(res => {
        console.log("ERROR++++++++++", res?.response.data)
        console.log("ERROR++++++++++", res?.response.data.message)
        toast.error("Error: ", res?.response?.data)
      })
      console.log('set avatar', new_user);
    }}>
      <img
        src={item.image}
        style={{
          position: 'relative',
          width: '80%',
          margin: 'auto',
          borderRadius: '10%',
          boxShadow: index == user.avatar ? '10px 10px 10px rgba(255,0,0,0.5)' : 'none',
        }}
      />
      <Text style={{ color: 'white', fontSize: isPC ? '18px' : '32px' }}>{item.name}</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Image source={require("../assets/character/character1.webp")}
          style={{
            width: '100%', height: '100%',
            margin: 'auto'
          }}
        />
      </View>
    </View >
  );
  const renderCharacter = ({ item, index }) => (
    <View style={{
      padding: '10px',
      width: isPC ? '30%' : '40%',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
      background: 'rgba(0,0,255,0.1)',
      border: item.name == character ? '1px solid gray' : 'none',
      borderRadius: '10px'
    }} onClick={() => {
      setCharacter(item.name)
    }}>
      <img
        src={require(`../assets/character/${item.name}.png`)}
        style={{
          position: 'relative',
          width: '70px',
          margin: 'auto',
          borderRadius: '10%',
        }}
      />
      <Text style={{ color: 'white', fontSize: '18px'}}>{item.name}</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Image source={require("../assets/character/character1.webp")}
          style={{
            width: '100%', height: '100%',
            margin: 'auto'
          }}
        />
      </View>
    </View >
  );

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
            borderRight: "1px solid gray"
          }}>
            <Image source={require("../assets/avatar/nft_mobber_1.jpg")}
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
          justifyContent: 'space-between'
        }}>
          <View style={{
            width: '100%',
            height: isPC ? '100px' : '100px',
            borderBottom: "1px solid gray",
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: isPC ? '74px' : '64px',
              color: '#FDC6D3',
              WebkitTextStroke: '1px #EF587B',
              filter: 'drop-shadow(0px 0px 20px #EF587B)',
              fontWeight: '700',
              // textShadow: '0 0 5px #fff',
              fontFamily: 'Horizon'
            }}>My NFTs</Text>
          </View>

          <View style={{
            padding: '25px',
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            margin: 'auto',
            flex: 1, justifyContent: 'center'
          }}>
            {(user && user.nfts) ? user.nfts.map((item, index) => {
              return renderAvatar({ item, index })
            }) : 'NFTs not found'}
          </View>
          <View style={{
            width: '100%',
            height: isPC ? '100px' : '100px',
            borderBottom: "1px solid gray",
            borderTop: "1px solid gray",
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: isPC ? '74px' : '64px',
              color: '#FDC6D3',
              WebkitTextStroke: '1px #EF587B',
              filter: 'drop-shadow(0px 0px 20px #EF587B)',
              fontWeight: '700',
              // textShadow: '0 0 5px #fff',
              fontFamily: 'Horizon'
            }}>My Character</Text>
          </View>
          <View style={{
            padding: '25px',
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            margin: 'auto',
            columnGap: '10px',
            rowGap: '10px',
            flex: 1, justifyContent: 'center'
          }}>
            {(characters) ? characters.map((item, index) => {
                  return renderCharacter({ item, index })
                }) : 'NFTs not found'}
          </View>
          {/* <View style={{
            padding: '25px',
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            margin: 'auto',
            flex: 1, justifyContent: 'center'
          }}>
            <View style={{
              padding: '10px',
              width: '100%',
              display: 'flex', flexDirection: 'column',
              cursor: 'pointer',
              // background: 'rgba(0,0,255,0.1)',
              borderRadius: '10px'
            }} >
              <View style={{
                padding: isPC? '30px': '50px',
                borderRadius: '10px',
                background: 'rgba(0,0,255,0.2)',
              }}>
                
                <img
                  src={character ? require(`../assets/character/${character}.png`) : require(`../assets/character/bacon.png`)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    margin: 'auto',
                    borderRadius: '10%',
                  }}
                />
              </View>
            </View>
          </View> */}
        </View>
      </View>
    </View >
  );
}
