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

// Personal informations
import GameContext from '../context/GameContext';
import ServerListDialog from './ServerListDialog';
import { globalMap } from "../global/globalMap";
import { keyMap_1, keyMap_2, keyMap_Both, keyMap_None } from "../global/keyMap";
import { Linking } from 'react-native';
import JoiningDialog from './JoiningDialog';
import HighScoreDialog from './HighScore';
import { View, Text, Image, Platform, Dimensions } from 'react-native';
import { socket, FRONTEND_URL, SERVER_URL } from '../global/global';

// Landing Page component
const LandingScreen = () => {

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
        contextGameMap, setContextGameMap } = React.useContext(GameContext);

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
    const [otherName, setOtherName] = useState("waiting...");

    const [roomPath, setRoomPath] = useState(FRONTEND_URL);
    const [openRoom, setOpenRoom] = useState(false);
    const [openHighScore, setOpenHighScore] = useState(false);
    const [serverId, setServerId] = useState('');

    // Receiving events from the server
    useEffect(() => {
        const handleSocketMessage = (data) => {
            if (data.cmd === "ROOM_CREATED") {
                console.log("Received--Message------------- : ", data);

                // console.log("room created");
                setRole('server');
                setGameMode(2);
                setRoomPath(FRONTEND_URL + "/?" + data.name);
                setOpenRoom(true);
            }
        };
        const handleSocketRoom = (data) => {

            console.log("Received--Room------------- : ", data);

            if (data.cmd == "GOT_JOINED_TO_CLIENT") {
                if (data.state) {
                    setRole('client');
                    setGameMode(2);
                    setContextGameMap(data.globalMap);
                    setOtherName(data.player1);
                    setOpenRoom(true);
                } else {
                    window.alert(data.reason);
                }
            }
            if (data.cmd == "GOT_JOINED_TO_SERVER") {
                // window.alert("setRole('server');");
                console.log("JOined : ", data);
                setRole('server');
                setGameMode(2);
                setContextGameMap(data.globalMap);
                setOtherName(data.player2);
            }
            if (data.cmd == "START_GAME_APPROVED") {
                // window.alert("ROLE:", role);
                console.log("Reached Approve");
                navigation.navigate("GameScreen_2");
            }
        }

        socket.on('message', handleSocketMessage);
        socket.on('ROOM', handleSocketRoom);

        console.log("--------------con2------");
        return () => {
            socket.off('message', handleSocketMessage);
            socket.off('ROOM', handleSocketRoom);
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            // overflow: 'hidden',
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
            }}>

                <div>
                    <h1 className='title'>The Road to Valhalla!!!!!</h1>
                </div>
                <div style={{
                    background: 'rgba(0,0,255,0.4)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <img src={serverId == "" ? require("../assets/avatar/avatar_server.jpg") : require("../assets/avatar/avatar_client.jpg")}
                        style={{
                            borderRadius: '50%', margin: '1rem',
                            boxShadow: serverId == "" ? '10px 10px 10px rgba(255,0,0,0.4)' : '10px 10px 10px rgba(0,2550,0.4)'
                        }}></img>
                    <div style={{
                        display: "flex",
                        flexDirection: 'row',
                        color: 'white',
                        fontSize: '1rem',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: '1rem',
                        height: '2.5rem'
                    }}>
                        <input style={{ padding: '0.5rem', flex: 1, border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f5f5f5', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', outline: 'none', fontSize: '1rem', color: '#333', transition: 'box-shadow 0.3s, border-color 0.3s', lineHeight: '1.5' }}
                            type="text" placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                            autoFocus />
                    </div>

                    <button className="decoration-button" onClick={() => {
                        if (userName !== "") {
                            setGameMode(0);
                            navigation.navigate("GameScreen");
                        }
                    }} >Play !</button>


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

                    <button className="decoration-button" onClick={() => {
                        setOpenHighScore(true);
                    }}>High Scores</button>

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
                </div>


            </div>
        </div>
    );
};

export default LandingScreen;


// CSS styles for drawing the stars actively moving everywhere.
const styles = `
    .star {
        position: absolute;
        background-color: white;
        border-radius: 50%;
        width: 2px;
        height: 2px;
        animation: starAnimation 5s linear infinite;
    }

    @keyframes starAnimation {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(150vw, 150vh) scale(0.9);
            opacity: 1;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .title {
        color : white;
        font-size : 60px;
        margin-bottom : 80px;
        transition : all 2s;
        transform : scale(1);
        cursor : pointer;
    }

    .title:hover{
        transition : all 2s;
        transform : scale(1.2);
        cursor : pointer;
    }

    .decoration-button {
        background-color: transparent;
        border-radius : 1rem;
        color: white;
        margin : 1rem;
        margin-top : 0.75rem;
        margin-bottom : 0.75rem;
        letter-spacing : 2px;
        border: 2px solid white;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
        height : 3rem;
    }

    .decoration-button:hover {
        background-color: rgba(0,0,255,0.2);
        color : white;
        border : 2px solid green;
        transition : 1s all;
        transform : scale(1.1);
    }

    @keyframes glow {
        0% {
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 60px #ff00de, 0 0 70px #ff00de;
        }
        100% {
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 60px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de;
        }
    }

    h1 {
        color: white;
        font-size: 40px;
        animation: glow 1s infinite alternate;
    }


`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
