import { AppProvider } from '@/context/context';
import { Link, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, StyleSheet, Text, View } from 'react-native';

import PhoneOnlyGate from '@/components/android-only-gate';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { PokemonColors } from '@/constants/pokemon-theme';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <PhoneOnlyGate>
      <AppProvider>
        <AnimatedSplashOverlay />

        {/* Web-only — native builds don't need to advertise themselves */}
        {Platform.OS === 'web' && (
          <Link href="/download" asChild>
            <View style={styles.downloadBanner}>
              <Text style={styles.bannerText}>📲 Get the native app →</Text>
            </View>
          </Link>
        )}

        <Slot />
      </AppProvider>
    </PhoneOnlyGate>
  );
}

const styles = StyleSheet.create({
  downloadBanner: {
    backgroundColor: PokemonColors.navy,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: PokemonColors.border,
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
  bannerText: {
    color: PokemonColors.yellow,
    fontSize: 13,
    fontWeight: '700',
  },
});