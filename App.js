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
import React, { useEffect, lazy, Suspense , useTransition } from "react";
import { ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';
import { useFonts } from "expo-font";
import EXAppLoading from "expo-app-loading";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Personal informations
import GameProvider from "./context/GameProvider";
// import GameScreen from "./screens/GameScreen";
import AudioManager from "./src/AudioManager";
import { useResolvedValue } from "./src/hooks/useResolvedValue";
import ModelLoader from "./src/ModelLoader";
import LandingScreen from "./screens/LandingScreen";
import GuideScreen from "./screens/GuideScreen";
import LoadingScreen from "./screens/LoadingScreen";

import LoadingScreen2 from "./screens/LoadingScreen2";
// import LeaderboardScreen from "./screens/LeaderboardScreen";
import GameRoomScreen from "./screens/GameRoomScreen";
import AdminScreen from "./screens/AdminScreen";
import NFTScreen from "./screens/NFTScreen";
import DepositScreen from "./screens/DepositScreen";
import Screen from "./screens/HomeScreen";

const GameScreen = lazy(() =>(import('./screens/GameScreen')));
const LeaderboardScreen = lazy(() => (import('./screens/LeaderboardScreen')));
// const GameRoomScreen = lazy(() => (import('./screens/GameRoomScreen')));
// const AdminScreen = lazy(() => (import('./screens/AdminScreen')));
// const NFTScreen = lazy(() => (import('./screens/NFTScreen')));

import { AlertNotificationRoot } from 'react-native-alert-notification';
import { Toaster } from "react-hot-toast";
// Global variables
const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    localStorage.wallet = ""
  })
  return (
    <GameProvider>
      <AssetLoading>
        <SafeAreaProvider>

          <NavigationContainer>
            <Stack.Navigator>

              {/* LoadingPage Page */}
              <Stack.Screen name="LoadingScreen" component={LoadingScreen}
                options={{ headerShown: false }} />

              <Stack.Screen name="LandingScreen" component={LandingScreen}
                options={{ headerShown: false }} />

              <Stack.Screen name="GameRoomScreen" component={GameRoomScreen}
                options={{ headerShown: false }} />

              <Stack.Screen name="GuideScreen" component={GuideScreen}
                options={{ headerShown: false }} />
{/* 
              <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen}
                options={{ headerShown: false }} /> */}

              <Stack.Screen name="LeaderboardScreen" options={{ headerShown: false }}>
                {() => (
                  <Suspense fallback={<LoadingScreen2 />}>
                    <LeaderboardScreen />
                  </Suspense>
                )}
              </Stack.Screen>


              <Stack.Screen name="NFTScreen" component={NFTScreen}
                options={{ headerShown: false }} />

              <Stack.Screen name="AdminScreen" component={AdminScreen}
                options={{ headerShown: false }} />
              <Stack.Screen name="DepositScreen" component={DepositScreen}
                options={{ headerShown: false }} />
              <Stack.Screen name="HomeScreen" component={Screen}
                options={{ headerShown: false }} />

              {/* // Single play on the local machine */}
              {/* <Stack.Screen name="GameScreen" component={() => {
                return <GameScreen gameMode={0} />;
              }} options={{ headerShown: false }} /> */}
              <Stack.Screen name="GameScreen" options={{ headerShown: false }}>
                {() => (
                  <Suspense fallback={<LoadingScreen2 />}>
                    <GameScreen gameMode={0}/>
                  </Suspense>
                )}
              </Stack.Screen>

              {/* // Two players on the local machine */}
              <Stack.Screen name="GameScreen_1" component={() => {
                return <GameScreen gameMode={1} />;
              }} options={{ headerShown: false }} />

              {/* // Two players via network */}
              <Stack.Screen name="GameScreen_2" component={() => {
                return <GameScreen gameMode={2} />;
              }} options={{ headerShown: false }} />

            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </AssetLoading>
      <Toaster />
    </GameProvider>

  );
}

function AssetLoading({ children }) {
  const [fontLoaded] = useFonts({
    retro: require("./assets/fonts/retro.ttf"),
  });

  const [audioLoaded, audioLoadingError] = useResolvedValue(() =>
    AudioManager.setupAsync()
  );

  const [modelsLoaded, modelLoadingError] = useResolvedValue(() =>
    ModelLoader.loadModels()
  );

  console.log("Loading:", {
    fonts: fontLoaded,
    audio: audioLoaded,
    models: modelsLoaded,
  });

  if (modelLoadingError) {
    return (
      <ErrorScreen
        message={modelLoadingError.message}
        stack={modelLoadingError.stack}
      />
    );
  }
  if (audioLoadingError) {
    return (
      <ErrorScreen
        message={audioLoadingError.message}
        stack={audioLoadingError.stack}
      />
    );
  }
  if (modelsLoaded && fontLoaded && audioLoaded) {
    return children;
  }

  return <EXAppLoading />;
}

const ErrorScreen = ({ message, stack }) => (
  <View style={styles.errorContainer}>
    <ScrollView style={styles.error} contentContainerStyle={{}}>
      <Text style={styles.errorTitle}>This is a fatal error 👋 </Text>
      <Text style={styles.errorText}>{message}</Text>
      {stack && (
        <Text
          style={[
            styles.errorText,
            { fontSize: 12, opacity: 0.8, marginTop: 4 },
          ]}
        >
          {stack}
        </Text>
      )}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  splash: {
    backgroundColor: "#87C6FF",
    resizeMode: "contain",
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    maxWidth: 300,
    maxHeight: "50%",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#9e0000",
  },
  errorTitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  errorText: {
    fontSize: 24,
    color: "white",
  },
});
