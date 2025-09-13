// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css'
import { NativeWindStyleSheet } from "nativewind";
import { AuthProvider } from '../contexts/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function RootLayout() {
  
  return (
    <AuthProvider>
      <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <SafeAreaView>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="email-sent" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="admin-login" />
        <Stack.Screen name="(tabs)" />
        </SafeAreaView>
      </Stack>
      </SafeAreaProvider> 
    </AuthProvider>
  );
}