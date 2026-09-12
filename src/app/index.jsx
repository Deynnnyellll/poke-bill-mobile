import useTyper from '@/hooks/useTyper';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenFooter from '@/components/screen-footer';
import ScreenHeader from '@/components/screen-header';
import { PokemonColors, TYPE_BADGES } from '@/constants/pokemon-theme';

export default function HomeScreen() {
  // this is for useTyper
  const DIALOG_TEXT = "A wild BILL appeared! Log the items and we'll split it.";
  const TYPE_SPEED_MS = 30;
  
  const router = useRouter();

  // call the custom hook
  const typedDialogText = useTyper(DIALOG_TEXT, TYPE_SPEED_MS);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <ScreenHeader
          eyebrow="ENCOUNTER"
          eyebrowMuted="BILL NOT LOGGED YET"
          title="Split the bill"
        />

        <View style={styles.dialogBox}>
          <Text style={styles.dialogText}>{typedDialogText}</Text>
          <Text style={styles.dialogArrow}>▼</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.screenBox}>
            <Text style={styles.screenText}>
              <Text style={styles.screenTextYellow}>Bill</Text>
              {'\n'}
              <Text style={styles.screenTextWhite}>Splitter</Text>
            </Text>
          </View>

          <View style={styles.badgeRow}>
            {TYPE_BADGES.map((badge) => (
              <View
                key={badge.label}
                style={[
                  styles.badge,
                  { backgroundColor: badge.bg, borderColor: badge.border },
                ]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.metaText}>3 trainers · 6 steps</Text>
        </View>

        <ScreenFooter
          nextLabel="Start the split"
          onNext={() => router.push('/party')}
        />
      </View>
    </SafeAreaView>
  );
}

const NAVY = '#2B3A6B';
const CREAM = '#FBF6E3';
const YELLOW = '#F5C445';
const BORDER = '#1A1A1A';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },
  card: {
    flex: 1,
    backgroundColor: CREAM,
  },
  dialogBox: {
    backgroundColor: PokemonColors.cream,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 3,
    borderBottomColor: BORDER,
  },
  dialogText: {
    color: PokemonColors.bodyText,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  dialogArrow: {
    position: 'absolute',
    right: 20,
    bottom: 8,
    color: '#C1524C',
    fontSize: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  screenBox: {
    width: '86%',
    aspectRatio: 1.7,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: BORDER,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  screenTextYellow: {
    color: YELLOW,
  },
  screenTextWhite: {
    color: '#FFFFFF',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  metaText: {
    color: '#7A7E88',
    fontSize: 13,
    fontWeight: '600',
  },
});
