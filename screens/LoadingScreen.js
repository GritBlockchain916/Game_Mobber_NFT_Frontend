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
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, Platform, Dimensions } from 'react-native';
import GameContext from '../context/GameContext';

// Landing Page component
const LoadingScreen = () => {

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

    // Personal variables
    const [isLoading, setIsLoading] = useState(true);
    const [loadingPercent, setLoadingPercent] = useState(1);
    const [speed, setSpeed] = useState(100); // MBC- Change the speed to 1 on the devMode

    useEffect(() => {
        if (loadingPercent < 100) {
            const intervalId = setInterval(() => {
                setLoadingPercent(prev => {
                    if (prev >= 99) {
                        clearInterval(intervalId);
                        return 100;
                    }
                    if (prev >= 95) return prev + 1;
                    if (prev >= 90) return prev + 2;
                    else if (prev >= 60) return prev + 3;
                    else if (prev >= 10) return prev + 2;
                    else return prev + 1;
                });
            }, speed);
            return () => clearInterval(intervalId);
        }
    }, [])

    useEffect(() => {
        if (loadingPercent >= 100) {
            setIsLoading(false);
            setTimeout(() => {
                navigation.navigate("LandingScreen");
            }, 10); // MBC - this must be changed which shows the delay after loading
        }
    }, [loadingPercent]); // Monitor loadingPercent changes

    return (
        <View style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            // overflow: 'hidden',
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Image source={require("../assets/crossy_logo.png")}
                style={{ width: 300, height: 300 }}
            />

            <Text style={{
                position: 'absolute',
                textAlign: 'center',
                right: '1rem',
                bottom: '1rem',
                fontSize: isPC ? '100px' : '72px',
                left: isMobile ? '0px' : 'undefined',
                fontWeight: '800',
                padding: '5px',
                fontWeight : '900',
                
                color: '#FDC6D3',
                WebkitTextStroke: '1px #EF587B',
                filter: 'drop-shadow(0px 0px 20px #EF587B)',
                fontWeight: '700',
                fontFamily: 'Horizon'
                // ...(isMobile ? { left: '0px' } : {}), 
            }}>
                {loadingPercent} %
            </Text>
        </View>
    );
};

export default LoadingScreen;

