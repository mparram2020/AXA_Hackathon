import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { InsuranceProvider } from '@/context/InsuranceContext'; // Import the provider

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <InsuranceProvider> {/* Wrap the app with InsuranceProvider */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="claims/selection" options={{ headerShown: false }} />
          <Stack.Screen name="claims/new" options={{ headerShown: false }} />
          <Stack.Screen name="claims/simplified" options={{ headerShown: false }} />
          
          <Stack.Screen name="insurance/step1" options={{ headerShown: false }} />
          <Stack.Screen name="insurance/step2" options={{ headerShown: false }} />
          <Stack.Screen name="insurance/step3" options={{ headerShown: false }} />
          <Stack.Screen name="insurance/step4" options={{ headerShown: false }} />
          <Stack.Screen name="insurance/offer" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </InsuranceProvider>
  );
}
