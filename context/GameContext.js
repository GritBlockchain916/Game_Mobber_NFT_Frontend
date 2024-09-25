import { createContext } from 'react';
// import { keyMap_1 } from '../global/keyMap';

export default createContext({
    user: {}, setUser() { },
    character: 'brent', setCharacter() { },
    otherCharacter: 'brent', setOtherCharacter() { },
    highscore: 0, setHighscore() { },
    gameMode: 1,
    contextGameMap : [],
    setContextGameMap() {},
    role : 'server',
    setRole() {},
    keyMap_Server : [],
    setKeyMap_Server() {},
    keyMap_Client : [],
    setKeyMap_Client() {},
    socket : undefined,
    setSocket() {},
    adminWallet:"aaa",
    setAdminWallet(){},
    userInfo: {},
    setUserInfo(){},
    cUserName: '',
    setCUserName(){}
});
