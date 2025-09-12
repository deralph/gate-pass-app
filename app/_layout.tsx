// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css'
import { NativeWindStyleSheet } from "nativewind";
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values'; // fixes crypto.getRandomValues() for Hermes




export default function RootLayout() {
  
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="email-sent" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="admin-login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}