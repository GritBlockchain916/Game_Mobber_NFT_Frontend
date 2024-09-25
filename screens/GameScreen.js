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
import React, { Component, useState, useEffect, useContext } from "react";
import { GLView } from "expo-gl";
import { Text, Animated, Dimensions, StyleSheet, Platform, Vibration, View, useColorScheme, } from "react-native";

// Personal informations MBC-
import GestureRecognizer, { swipeDirections } from "../components/GestureView";
import ScorePad from "../components/GameScorePad";
import Engine from "../src/GameEngine";
import State from "../src/state";
import GameOverScreen from "./GameOverScreen";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import GameContext from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";

// Global variables : MBC-on mobile responsive
import { keyMap_None, keyMap_1, keyMap_2, keyMap_Both } from "../global/keyMap";
import { globalMap } from "../global/globalMap";
import HeaderScreen from "./HeaderScreen";
import { updateScore, socket } from "../global/global";


const DEBUG_CAMERA_CONTROLS = false;
class Game extends Component {
  static contextType = GameContext;


  constructor(props) {
    super(props);
    this.isMobile = props.isMobile;
    this.side = props.side;
    this.gameMode = props.gameMode;
    this.newGlobalMap = props.newGlobalMap;
    this.keyMap = props.keyMap;
    this.character = props.character;
    this.isDarkMode = props.isDarkMode;
    this.rate = localStorage.rate;
    this.isMap = props.isMap;

  }
  /// Reserve State for UI related updates...
  state = {
    ready: false,
    score: 0,
    viewKey: 0,
    gameState: State.Game.none,
    showSettings: false,
    rightOver: false
    // gameState: State.Game.gameOver
  };

  transitionScreensValue = new Animated.Value(1);
  handleSockGame = (data) => {
    if (data.cmd == "OTHER_PLAYER_OVER") {
      // console.log("-----------die-------------");
      this.setState({ rightOver: true });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps, nextState) {

    if (nextState.gameState && nextState.gameState !== this.state.gameState) {
      this.updateWithGameState(nextState.gameState, this.state.gameState);
    }
    if (this.engine && nextProps.character !== this.props.character) {
      this.engine._hero.setCharacter(nextProps.character);
    }
    // Previous commented code and it MBC-
    // if ((this.state.gameState === State.Game.playing || this.state.gameState === State.Game.paused) && nextProps.isPaused !== this.props.isPaused) {
    //   this.setState({ gameState: nextProps.isPaused ? State.Game.paused : State.Game.playing })
    // }
    // if (nextProps.character.id !== this.props.character.id) {
    //   (async () => {
    //     this.world.remove(this._hero);
    //     this._hero = this.hero.getNode(nextProps.character.id);
    //     this.world.add(this._hero);
    //     this._hero.position.set(0, groundLevel, startingRow);
    //     this._hero.scale.set(1, 1, 1);
    //     this.init();
    //   })();
    // }
  }
  updateTopScore = async () => {
    await updateScore(this.state.score, localStorage.wallet, localStorage.token);
  }
  transitionToGamePlayingState = () => {
    Animated.timing(this.transitionScreensValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
      onComplete: ({ finished }) => {
        // console.log("gameEngine = ", this.isMap);
        this.engine.setupGame(this.gameMode, this.props.character, this.newGlobalMap, this.isMap);
        this.engine.init();

        if (finished) {
          Animated.timing(this.transitionScreensValue, {
            toValue: 1,
            useNativeDriver: true,
            duration: 300,
          }).start();
        }
      },
    }).start();
  };

  // This is the part for starting the game
  updateWithGameState = (gameState) => {
    if (!gameState) throw new Error("gameState cannot be undefined");

    if (gameState === this.state.gameState) {
      return;
    }
    const lastState = this.state.gameState;

    this.setState({ gameState });
    this.engine.gameState = gameState;
    const { playing, gameOver, paused, none } = State.Game;
    switch (gameState) {
      case playing:
        if (lastState === paused) {
          this.engine.unpause();
        } else if (lastState !== none) {
          this.transitionToGamePlayingState();
        } else {

          // GAME-START PART !!!

          // Coming straight from the menu.
          // this.engine._hero.stopIdle();
          // this.onSwipe(swipeDirections.SWIPE_UP);
        }

        break;
      case gameOver:
        break;
      case paused:
        this.engine.pause();
        break;
      case none:
        if (lastState === gameOver) {
          this.transitionToGamePlayingState();
        }

        this.setState({ rightOver: false });
        this.newScore();

        break;
      default:
        break;
    }
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.engine.raf);
  }

  async componentDidMount() {
    // Previous Code MBC-
    // AudioManager.sounds.bg_music.setVolumeAsync(0.05);
    // await AudioManager.playAsync(
    //   AudioManager.sounds.bg_music, true
    // );
    Dimensions.addEventListener("change", this.onScreenResize);
  }

  onScreenResize = ({ window }) => {
    this.engine.updateScale();
  };

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onScreenResize);
    socket.off('ROOM', this.handleSockGame);
  }

  UNSAFE_componentWillMount() {
    const { role } = this.context;
    this.engine = new Engine();
    // this.engine.hideShadows = this.hideShadows;
    this.engine.onUpdateScore = (position) => {
      if (this.state.score < position) {
        this.setState({ score: position });
      }
    };
    this.engine.onGameInit = () => {
      this.setState({ score: 0 });
      this.setState({ rightOver: false });
    };
    this.engine._isGameStateEnded = () => {
      return this.state.gameState !== State.Game.playing;
    };
    this.engine.onGameReady = () => this.setState({ ready: true });
    this.engine.onGameEnded = () => {
      console.log("----onGameEnded");

      if (this.gameMode == 2) {
        if (this.side == "left") {
          socket.emit('message', JSON.stringify({
            cmd: 'REGISTER_SCORE',
            role: role,
            score: this.state.score
          }));
        }
      }
      this.setState({ gameState: State.Game.gameOver });
      // this.props.navigation.navigate('GameOver')
    };

    socket.on('ROOM', this.handleSockGame);
    this.engine.setupGame(this.gameMode, this.props.character, this.newGlobalMap, this.isMap);
    this.engine.init();

  }

  newScore = () => {
    // Vibration.cancel();
    // this.props.setGameState(State.Game.playing);
    this.setState({ score: 0 });
    this.engine.init();
  };

  onSwipe = (gestureName) => this.engine.moveWithDirection(gestureName);

  renderGame = () => {
    if (!this.state.ready) return;

    return (
      <GestureView
        pointerEvents={DEBUG_CAMERA_CONTROLS ? "none" : undefined}
        onStartGesture={this.engine.beginMoveWithDirection}
        keyMap={this.keyMap}
        gameMode={this.gameMode}
        globalMap={this.globalMap}
        onSwipe={this.onSwipe}
      >
        <GLView
          style={{ flex: 1, height: "100%", overflow: "hidden", borderBottomLeftRadius: '50px' }}
          onContextCreate={this.engine._onGLContextCreate}
        />
      </GestureView>
    );
  };

  renderOtherGameOver = () => {

    // if (this.state.rightOver == false) {
    //   return null;
    // }
    return (
      <View style={[
        StyleSheet.absoluteFill,
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: '5000'
        }]}>
        <Text style={{
          fontSize: '64px',
          color: '#FDC6D3',
          WebkitTextStroke: '1px #EF587B',
          filter: 'drop-shadow(0px 0px 20px #EF587B)',
          fontWeight: '700',
          // textShadow: '0 0 5px #fff',
          fontFamily: 'Horizon'
        }}>Game Over</Text>
      </View>
    );
  }


  renderGameOver = () => {
    if (this.state.gameState !== State.Game.gameOver) {
      return null;
    }
    const { loading } = this.context;
    // console.log("22222222222222222222 ", localStorage.token);
    
    if(!loading) this.updateTopScore();

    return (
      <View style={[
        StyleSheet.absoluteFill,
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: '5000'
        }]}>
        <GameOverScreen
          showSettings={() => {
            this.setState({ showSettings: true });
          }}
          setGameState={(state) => {
            this.updateWithGameState(state);
          }}
          score={this.state.score}
        />
      </View>
    );
  };

  renderHomeScreen = () => {

    if (this.state.gameState !== State.Game.none) {
      return null;
    }
    return (
      <View style={{ zIndex: 8888 }}>
        <HomeScreen
          onPlay={() => {
            this.updateWithGameState(State.Game.playing);
          }}
        />
      </View>
    );
  };

  renderSettingsScreen() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <SettingsScreen goBack={() => this.setState({ showSettings: false })} />
      </View>
    );
  }

  render() {
    const { isPaused } = this.props;

    return (
      <View
        pointerEvents="box-none"
        style={[
          {
            width: this.side == 'left' ? '100%' : (this.isMobile ? '30%' : '20%'),
            height: this.side == 'left' ? 'calc(100vh - 100px)' : (this.isMobile ? '25%' : '20%'),
            marginTop: this.side == 'right' ? '100px' : '0px',
            right: '0px',

            borderLeft: this.side == 'right' ? '2px solid gray' : '0px solid gray',
            borderBottom: this.side == 'right' ? '2px solid gray' : '0px solid gray',
            borderBottomLeftRadius: this.side == 'right' ? '50px' : '0px',
          },
          Platform.select({
            web: { position: "fixed" },
            default: { position: "absolute" },
          }),
          this.props.style,
        ]}
      >
        <Animated.View
          style={{
            flex: 1, opacity: this.transitionScreensValue,
            borderBottomLeftRadius: '50px'
          }}
        >
          {this.renderGame()}
        </Animated.View>

        {this.side == "left" ?
          <ScorePad
            score={this.state.score}
            gameOver={this.state.gameState === State.Game.gameOver}
            rate={this.rate&&!isNaN(this.rate)? this.rate: 0}
          /> : <></>
        }
        {this.state.rightOver && this.side == "right" && (<View
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5000,
            borderBottomLeftRadius: this.side == 'right' ? '50px' : '0px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          }}
        >
          <Text
            style={{
              fontSize: 64,
              color: '#FDC6D3',
              WebkitTextStroke: '1px #EF587B',
              filter: 'drop-shadow(0px 0px 20px #EF587B)',
              fontWeight: '700',
              fontFamily: 'Horizon',
              textAlign: 'center', // Ensure text is centered
            }}
          >
            Game Over
          </Text>
        </View>)
        }

        {this.side == "left" ? this.renderGameOver() : <></>}
        {/* {this.side == "right" ? this.renderOtherGameOver() : <></>} */}

        {this.renderHomeScreen()}

        {/* {this.state.showSettings && this.renderSettingsScreen()} */}

        {isPaused && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: "rgba(105, 201, 230, 0.8)",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            {/* {this.state.rightOver && (
            <Text style={{ fontSize: 88, color: "red", fontWeight: "bold" }}>
              Game Over
            </Text>
          )} */}
          </View>
        )}

      </View>
    );
  }
}

const GestureView = ({ onStartGesture, onSwipe, ...props }) => {

  const { socket, role } = useContext(GameContext);

  const config = {
    velocityThreshold: 0.2,
    directionalOffsetThreshold: 80,
  };

  React.useEffect(() => {
    // window.alert('asdf' + role);
  }, []);


  return (
    <GestureRecognizer
      onResponderGrant={() => {
        onStartGesture();
      }}
      onSwipe={(direction) => {
        onSwipe(direction);
      }}
      config={config}
      onTap={() => {
        onSwipe(swipeDirections.SWIPE_UP);
      }}
      style={{ flex: 1 }}
      socket={socket}
      role={role}
      {...props}
    />
  );
};

function GameScreen(props) {
  const scheme = useColorScheme();
  const navigation = useNavigation();

  const { gameMode, socket, character, contextGameMap, role, setRole, setMyRoomInfo, otherCharacter } = React.useContext(GameContext);

  const server_keyMaps = [keyMap_1, keyMap_None];
  const client_keyMaps = [keyMap_None, keyMap_2];


  /* ================================ For Mobile Responsive ===============================*/

  const [evalWidth, setEvalWidth] = useState(768);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < evalWidth);
  const [isPC, setIsPC] = useState(Dimensions.get('window').width >= evalWidth);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < evalWidth);
      setIsPC(window.innerWidth >= evalWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameMode == 2) {
        socket.emit('message', JSON.stringify({
          cmd: 'REGISTER_SCORE',
          role: role,
          score: -1
        }));
      }
      socket.off('ROOM', handleSocketEndGame);
    };

  }, []);

  /* ================================ For Mobile Responsive ===============================*/

  const handleSocketEndGame = (data) => {
    if (data.cmd == "END_GAME") {
      navigation.navigate("LandingScreen");
    }
    if (data.cmd == "OTHER_IS_OVER") {
      setMyRoomInfo(prevRoomInfo => ({
        ...prevRoomInfo,
        otherOver: true
      }));
    }

  }

  socket.on('ROOM', handleSocketEndGame);

  const gotoMenu = () => {
    if (gameMode == 2) {

      socket.emit('message', JSON.stringify({
        cmd: 'END_GAME',
      }));
    } else {
      navigation.navigate("LandingScreen");
    }
  };

  return (
    <>
      {/* Multi players via network */}
      {gameMode == 0 &&
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <HeaderScreen></HeaderScreen>
          <View style={{
            width: '100%',
            height: 'calc(100vh-100px)',
            display: 'flex'
          }}>

            <Game {...props}
              gameMode={gameMode}
              newGlobalMap={globalMap}
              keyMap={keyMap_Both}
              character={character} isDarkMode={scheme === "dark"}
              side="left"
            />
          </View>
        </View>

      }

      {gameMode == 2 && (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <HeaderScreen></HeaderScreen>

          {role == 'server' ?
            <>
              <View style={{ width: '100%', height: '100%', flex: 1 }}>
                <Game {...props}
                  gameMode={gameMode}
                  newGlobalMap={contextGameMap}
                  keyMap={server_keyMaps[0]}
                  character={character}
                  isDarkMode={scheme === "dark"}
                  side="left"
                  isMobile={isMobile}
                  style={{ background: 'red' }}
                  isMap={false}
                />
              </View>

              <View style={{ position: 'absolute', right: '0px', top: '0px', width: '50%', height: '50%', flex: 1 }}>
                <Game {...props}
                  gameMode={gameMode}
                  newGlobalMap={contextGameMap}
                  keyMap={client_keyMaps[0]}
                  character={otherCharacter}
                  side="right"
                  isMobile={isMobile}
                  isDarkMode={scheme === "dark"}
                  isMap={true}
                />

              </View>
            </> :
            // client screen view
            <>
              <View style={{ width: '100%', height: '100%', flex: 1 }}>
                <Game {...props}
                  gameMode={gameMode}
                  newGlobalMap={contextGameMap}
                  keyMap={client_keyMaps[1]}
                  character={character}
                  side="left"
                  isMobile={isMobile}
                  isDarkMode={scheme === "dark"}
                  isMap={false}
                />
              </View>

              <View style={{ position: 'absolute', right: '0px', top: '0px', width: '50%', height: '50%', flex: 1 }}>
                <Game {...props}
                  gameMode={gameMode}
                  newGlobalMap={contextGameMap}
                  keyMap={server_keyMaps[1]}
                  character={otherCharacter}
                  side="right"
                  isMobile={isMobile}
                  isDarkMode={scheme === "dark"}
                  isMap={true}
                />
              </View>
            </>}


        </View>
      )
      }

    </>
  );
}

export default GameScreen;
