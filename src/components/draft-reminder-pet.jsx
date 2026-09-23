import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

import { PokemonColors, PokemonTypography } from '@/constants/pokemon-theme';
import { getDraft } from '@/utils/split-draft';

import FlameCreature from '@/components/ui/flame-type-pet';

export default function DraftReminderPet({ onResume }) {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getDraft().then((saved) => {
      if (!cancelled) setDraft(saved);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!draft) return null;

  return (
    <Animated.View entering={SlideInRight.duration(450)} style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>Hey Trainer, you have an unfinished bill split!</Text>
        <Pressable
          onPress={() => onResume?.(draft)}
          style={({ pressed }) => [styles.resumeButton, pressed && styles.pressed]}>
          <Text style={styles.resumeButtonText}>Resume</Text>
        </Pressable>
        <View style={styles.bubbleArrow} />
      </View>

      <FlameCreature />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: -30,
    bottom: 150,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  bubble: {
    backgroundColor: PokemonColors.dialogBackground,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: 170,
    marginRight: -14,
    gap: 8,
  },
  bubbleText: {
    color: PokemonColors.bodyText,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  bubbleArrow: {
    position: 'absolute',
    right: -9,
    bottom: 18,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: PokemonColors.border,
  },
  resumeButton: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 10,
    backgroundColor: PokemonColors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resumeButtonText: {
    ...PokemonTypography.buttonText,
    fontSize: 13,
    color: PokemonColors.border,
  },
  pressed: {
    opacity: 0.8,
  },
});
