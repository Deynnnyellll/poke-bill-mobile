import { AppProvider } from '@/context/context';
import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import PhoneOnlyGate from '@/components/android-only-gate';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PhoneOnlyGate>
        <AppProvider>
          <AnimatedSplashOverlay />
          <Slot />
        </AppProvider>
      </PhoneOnlyGate>
    </ThemeProvider>
  );
}