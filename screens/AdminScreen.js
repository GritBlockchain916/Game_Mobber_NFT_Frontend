import { View, StyleSheet, Text, TextInput, Image, Platform, Animated, Dimensions, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigation } from "@react-navigation/native";
import { createWeb3Modal, defaultSolanaConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'
import { toast } from 'react-hot-toast';
import { Alert } from "react-native"
// Personal informations
import { colors, fonts, commonStyle } from '../global/commonStyle';
import GameContext from '../context/GameContext';
import HeaderScreen from "./HeaderScreen";
import { deepCopy } from "../global/common"
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { getAdminData, getCharacters, updateScore, updateNFTCharacter, addNFT, deleteNFT, setRewardRate, getTwitterMsg, setScoreTwitterMsg, getRate } from '../global/global';

// Initial Variables
export default function AdminScreen() {
  /* ================================ For Mobile Responsive ===============================*/
  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);
  const [xText, setXText] = useState("");
  const { address, chainId } = useWeb3ModalAccount()
  const {
    setLoadingState, userInfo
  } = React.useContext(GameContext);

  useEffect(() => {
    // getRateFromServer();
    // getTwitterMsgFromServer();
    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  /* ================================ For Mobile Responsive ===============================*/
  // Initial Variables
  const navigation = useNavigation();
  const [path, setPath] = useState("admin");

  // Personal Variables
  const { walletProvider, connection } = useWeb3ModalProvider()
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [contentHeight, setContentHeight] = useState(620);
    // Assume the total scrollable content height
  const windowHeight = isPC ? Dimensions.get('window').height - 418 : Dimensions.get("window").height - 418;

  const renderAdminAvatar = ({ item, index }) => (
    <View style={{
      marginBottom: '10px',
      width: '100%',
      padding: '2px',
      // background : 'rgba(255,255,255,0.8)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'relative',
      columnGap: '10px',
      alignItems: 'center',
      alignContent: 'center',
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '20px',
      }}>
        <img
          src={/.*\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.image) ? item.image : require(`../assets/nfts/nft-collection.webp`)}
          style={{
            position: 'relative',
            width: isPC ? '50px' : '25px',
            height: isPC ? '50px' : '25px',
            borderRadius: '9px',
            border: commonStyle.border,
            marginLeft: '10px',
          }}
        />
        {isPC && <Text 
                  style={{ 
                    margin: 'auto', 
                    flex: '1', 
                    textAlign: 'left', 
                    color: 'white', 
                    fontSize: '16px' 
                  }}>
                    {`${item?.address?.substring(0, 4)}...${item?.address?.substring(item?.address?.length-10)}`}
                </Text>
        }
      </View>
      <View style={{
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        columnGap: "10px"
      }}>
        <img
          src={ 
            (item?.character?.name) ? 
            require(`../assets/character/${item?.character?.name}.png`) : 
            require(`../assets/character/bacon.png`)
          }
          style={{
            position: 'relative',
            width: isPC ? '50px' : '25px',
            height: isPC ? '50px' : '25px',
            borderRadius: '9px',
            border: commonStyle.border,
            marginLeft: '10px',
          }}
        />
        <Dropdown
          style={{  // main selected item
            width: isPC ? '140px' : '120px',
            cursor: 'pointer',
            // backgroundColor: 'black',
            textAlign: 'center',
            border: commonStyle.border,
            borderRadius: '50px',
            height: isPC ? '45px': '30px',
            margin: 'auto',
          }}
          containerStyle={{ // main selected item
            backgroundColor: 'black',
            textAlign: 'center',
          }}
          placeholderStyle={{ // placeholder text style
            color: 'grey',
            // backgroundColor: 'black',
            textAlign: 'center',
            // border: '1px solid white'
          }}
          selectedTextStyle={{  // main selected item text style
            color: 'white',
            // backgroundColor: 'black',
            textAlign: 'center',
            borderWidth: commonStyle.border,
          }}
          itemContainerStyle={{ // list item container style
            backgroundColor: 'black',
            textAlign: 'center',
          }}
          itemTextStyle={{  // list item text style
            // backgroundColor: 'black',
            color: 'white',
            textAlign: 'center',
          }}
          activeColor='#222222'
          mode={isPC ? 'auto' : 'modal'}
          ref={isPC ? top : undefined}
          inputSearchStyle={{  // list item text style
            backgroundColor: '#FF0000',
            color: 'white',
            textAlign: 'center',
          }}
          iconStyle={{  // main drop icon style
            // backgroundColor: '#0000FF',
            color: 'white',
            textAlign: 'center',
            width: '30px',
            height: '30px',
          }}
          data={characters}
          maxHeight={300}
          labelField="name"
          valueField="symbol"
          placeholder={isPC ? 'Select Character': 'Change'}
          value={name}
          renderItem={renderCharacterItem}
          onChange={character => {
            setSelCharacter(character)
            const new_admin = deepCopy(admin);
            new_admin.nfts[index].character = {
              id: character.id, 
              name: character.name
            };
            setAdmin(new_admin);
          }}        
        />
      </View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '3px',
        justifyContent: "center",
        alignItems: "center",
        width: isPC ? '160px': '80px',
      }}>
        <View 
          style={{
            ...commonStyle.button3,
            margin: 'auto',
          }}
          onClick={async() => {
            updateNFTCharacter(item.id, selCharacter.id, localStorage.wallet).then(res => {
              if(res.data.code === '00') {
                toast.success("Character updated!");
              }else {
                toast.error("Character updating failed!")
              }
            })
        }}>
          {isPC ? "Update" : <Icon name="save-outline" size={18} style={{color: 'white'}} />}
        </View>
        <View 
          style={{
            ...commonStyle.button3,
            margin: 'auto',
          }}
          onClick={() => {
            deleteNFT(item.id, localStorage.wallet).then(res => {
              if(res.data.code == "00"){
                const new_admin = deepCopy(admin);
                new_admin.nfts.splice(index, 1);
                setAdmin(new_admin);
                toast.success("Character deleted!")
              } else {
                toast.success("Character deleting failed!")
              }
            }).catch(err => {

            })     
        }}>
          {isPC ? "Delete" : <AntIcon name="delete" size={18} style={{color: 'white'}}/>}
        </View>      
      </View>
    </View >
  );

  const renderCharacterItem = (item) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
      columnGap: '10px',
    }}>
      <Image source={require(`../assets/character/${item.name}.png`)} style={{
        width: isPC ? "30px": "20px", height: isPC ? "40px": "25px"
      }} />
      <Text style={{ color: '#fff' }}>{item.name}</Text>
    </View>
  );
  // --- Admin Dashboard ---
  const [admin, setAdmin] = useState({
    nfts: [],
    taxWallet: '',
    rewardToken: '',
    taxPerUnit: 0
  })
  const [characters, setCharacters] = useState([])
  const [selCharacter, setSelCharacter] = useState({})
  
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
      // const signature = await walletProvider.sendTransaction(tx, connection);//Here token send

      // console.log("deposit2--------------->", signature);
      // await connection.confirmTransaction(signature, 'processed');

      // console.log("deposit3--------------->", signature);
      // let res = await sendAndConfirmVersionedTransactions(connection, tx);
      // console.log("res = ", res);
      socket.emit('message', JSON.stringify({
        cmd: 'TOKEN_DEPOSITED', role: role
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
    } catch (error) {
      console.error('Error depositng:', error);
      setLoadingState(false);
      return;
    }

    setLoadingState(false);

    return;
  }
  const setRateValue = async () => {
    if(rate == undefined || rate == "") {
      toast.error("Input rate value")
      return
    }
    let response = await setRewardRate(rate, localStorage.wallet);
    if(response?.data?.code == "00"){
      toast.success("Rate setted!", { style: {
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '5px 5px 10px 3px rgba(210, 0, 0, 0.7)',
        borderRadius: '10px',
        fontWeight: 400
      }})
      localStorage.rate= rate;
    }
    
  }

  const onClickTwitterMsg = async () => {
    if(xText == undefined || xText == "") {
      toast.error("Input xText value")
      return
    }
    let response = await setScoreTwitterMsg(xText, localStorage.wallet);
    console.log("onclicktwitermsg===", response);
    if(response?.data?.code == "00"){
      toast.success("Twitter Message setted!", { style: {
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '5px 5px 10px 3px rgba(210, 0, 0, 0.7)',
        borderRadius: '10px',
        fontWeight: 400
      }})
      localStorage.xText= xText;
    }
  }

  useEffect(() => {
    if(userInfo?.isAdmin == false) navigation.navigate("LandingScreen");
    console.log("user info =====", userInfo.isAdmin)
    // if(localStorage.wallet == "" || localStorage.wallet == undefined) toast("Connect wallet!")
  }, [address])

  useEffect(() => {
    
    setLoadingState(true)
    
    getAdminData(localStorage.wallet).then((response) => {
      if(response.data.code == "00"){
        setAdmin(response.data.data);
        setRate(response.data.data?.rate || 0 )
        setXText(response.data.data?.xText || "" )
      }
    })
    getCharacters().then((response) => {
      if(response.data.code == "00")          
        setCharacters(response.data.data)
      setLoadingState(false)
    }).catch(error => {
      setLoadingState(false)
    })
    
  }, []);  

  const [newTaxWallet, setNewTaxWallet] = useState('');
  const [newNFT, setNewNFT] = useState('');
  const [rate, setRate] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const addNewNFT = () => {
    // getNFTOne(newNFT).then((nft) => {
    //   let new_admin = deepCopy(admin)
    //   if (!new_admin.nfts)
    //     new_admin.nfts = [];
    //   new_admin.nfts.push(nft)
    //   setAdmin(new_admin);
    // })
    if(newNFT == undefined || newNFT == "") {
      toast.error("Input new NFT collection address")
      return;
    }
    addNFT(newNFT, selCharacter.id, localStorage.wallet).then(response => {
        let new_admin = deepCopy(admin)
        if (!new_admin.nfts)
          new_admin.nfts = [];
        if (response.data.code == "00"){
          toast.success("New NFT added!", { style: {
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '5px 5px 10px 3px rgba(210, 0, 0, 0.7)',
            borderRadius: '10px',
            fontWeight: 400
          }})
          new_admin.nfts.push({
            id: response.data.data.id,
            address: response.data.data.address,
            image: response.data.data.image,
          })
        } else 
          toast.error("New NFT adding failed!", { style: {
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '5px 5px 10px 3px rgba(210, 0, 0, 0.7)',
            borderRadius: '10px',
            fontWeight: 400
          }})
        setAdmin(new_admin);
    })
  }

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
              borderRight: commonStyle.border
            }}>
              <Image source={require("../assets/avatar/nft_mobber_2.jpg")}
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
            rowGap: '15px',
            width: isPC ? '50%' : '100%',
            padding: "20px",
            height: '100%',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Text style={{
                fontSize: isPC ? '96px' : '32px',
                color: '#FDC6D3',
                WebkitTextStroke: '1px #EF587B',
                filter: 'drop-shadow(0px 0px 20px #EF587B)',
                fontWeight: '700',
                fontFamily: 'Horizon'
            }}>Admin Dashboard</Text>   

            <View style={{
              display: 'flex', flexDirection: isPC ? 'row' : 'column', 
              maxWidth: '800px',
              width: '100%', alignItems: 'center', justifyContent: 'space-between', columnGap: '10px',
              rowGap: isPC ? 0 : '10px',
            }}>
              <Text style={{
                width:'80px',
                color: 'white',
                fontSize: '20px',
                display: 'block',
                fontFamily: 'Horizon',
                textAlign: 'left'
              }}
              >
                Add New NFT
              </Text>
              <TextInput style={{
                width: '100%',
                maxWidth: '620px',
                padding: '0.5rem',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                fontSize: '16px',
                textAlign: 'left',
                lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
              }}
                type="text" placeholder="Input new nft mint address."
                onChange={(e) => {
                  setNewNFT(e.target.value);
                }}
              />
              <View style={{
                  ...commonStyle.button,
                  width: isPC? '65px': '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '6px',
                  justifyContent: 'center'
                }}
                onClick={() => {
                  addNewNFT()
              }}>
                <AntIcon name="addfile" size={18} style={{color : 'white' }} />
                Add
              </View>
            </View>

            <View style={{
              display: 'flex', flexDirection: isPC ? 'row' : 'column', maxWidth: '800px',
              width: '100%', alignItems: 'center', justifyContent: 'space-between', columnGap: '10px',
              rowGap: isPC ? 0 : '10px',
            }}>
              <Text style={{
                width:'80px',
                color: 'white',
                fontSize: '20px',
                display: 'block',
                fontFamily: 'Horizon',
                textAlign: 'left'
              }}
              >
                Token Rate
              </Text>
              <TextInput style={{
                width: '100%',
                maxWidth: '620px',
                padding: '0.5rem',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                fontSize: '16px',
                textAlign: 'left',
                lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
              }}
                type="text" placeholder="Input token rate." value={rate}
                onChange={(e) => {
                  setRate(e?.target?.value);
                }}
              />
              <View 
                style={{
                  ...commonStyle.button,
                  width: isPC? '65px': '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '6px',
                  justifyContent: 'center'
                }}
                onClick={() => {
                  setRateValue()
              }}>
                <Icon name="save-outline" size={18} style={{color: 'white'}}/>
                Set
              </View>
            </View>
            <View style={{
              display: 'flex', flexDirection: isPC ? 'row' : 'column', maxWidth: '800px',
              width: '100%', alignItems: 'center', justifyContent: 'space-between', columnGap: '10px',
              rowGap: isPC ? 0 : '10px',
            }}>
              <Text style={{
                width:'80px',
                color: 'white',
                fontSize: '20px',
                display: 'block',
                fontFamily: 'Horizon',
                textAlign: 'left'
              }}
              >
                Twitter Message
              </Text>
              <TextInput style={{
                width: '100%',
                maxWidth: '620px',
                padding: '0.5rem',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                fontSize: '16px',
                textAlign: 'left',
                lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
              }}
                type="text" placeholder="Input twitter message." value={xText}
                onChange={(e) => {
                  setXText(e?.target?.value);
                }}
              />
              <View 
                style={{
                  ...commonStyle.button,
                  width: isPC? '65px': '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '6px',
                  justifyContent: 'center'
                }}
                onClick={() => {
                  onClickTwitterMsg()
              }}>
                <Icon name="save-outline" size={18} style={{color: 'white'}}/>
                Set
              </View>
            </View>
            {/* <View style={{
              display: 'flex', flexDirection: isPC ? 'row' : 'column', maxWidth: '800px',
              width: '100%', alignItems: 'center', justifyContent: 'space-between', columnGap: '10px',
            }}>
              <Text style={{
                width:'80px',
                color: 'white',
                fontSize: '20px',
                display: 'block',
                fontFamily: 'Horizon',
                textAlign: 'left'
              }}
              >
                Deposit
              </Text>
              <TextInput style={{
                width: '100%',
                maxWidth: '620px',
                padding: '0.5rem',
                flex: 1,
                border: '1px solid gray',
                borderRadius: '30px',
                background: 'transparent',
                fontSize: '16px',
                textAlign: 'left',
                lineHeight: '2',
                color: 'white',
                fontFamily: 'Horizon',
              }}
                type="text" placeholder="Amount of tokens to deposit." value={depositAmount}
                onChange={(e) => {
                  setDepositAmount(e?.target?.value);
                }}
              />
              <View style={{
                ...commonStyle.button,
                width: '65px',
              }}
                onClick={() => {
                  depostToken()
                }}>Apply
              </View>
            </View> */}

            <View style={{
              width: '100%',
              maxWidth: '800px',
            }}>

              <Text style={{
                color: 'white',
                fontSize: '20px',
                display: 'block',
                textAlign: 'left',
                fontFamily: 'Horizon',
              }}
              >
                NFT List
              </Text>
            </View>
            <View style={{
                marginTop: '10px', display: 'flex', flexDirection: 'column', flex: 1, height: '100%',
                border: '1px solid gray', borderRadius: '16px', width: '100%', padding: '10px',
                overflowY: 'scroll', scrollbarWidth: 'none', maxWidth: '800px', marginBottom: '20px',              
              }} 
            >
              {(admin && admin.nfts) ? admin.nfts.map((item, index) => {
                return renderAdminAvatar({ item, index })
              }) : ''}
            </View>
            {/* {contentHeight > windowHeight && <Animated.View
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
          />} */}
          </View>          
        </View>
        
      </View >
    
  );
}
