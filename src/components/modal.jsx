import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonColors } from '@/constants/pokemon-theme';
import MetalHuggingRope from './ui/metal-hugging';
import RopeKnotDragon from './ui/rope-knot-dragon';

export default function Modal(props) {
  const fallAnim = useRef(new Animated.Value(-260)).current; // vertical drop-in
  const swingAnim = useRef(new Animated.Value(0)).current;   // pendulum tilt, in degrees
  const [groupHeight, setGroupHeight] = useState(0);

  useEffect(() => {
    if (!props.isModal) return;

    fallAnim.setValue(-260);
    swingAnim.setValue(0);

    Animated.timing(fallAnim, {
      toValue: 0,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Give it a starting tilt as if momentum from the fall carried it sideways,
      // then let a low-friction spring decay that into a settled, subtle sway.
      swingAnim.setValue(9);
      Animated.spring(swingAnim, {
        toValue: 0,
        friction: 3.2,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, [props.isModal]);

  const pivotShift = groupHeight / 2;
  const rotate = swingAnim.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <>
      {props.isModal && (
        <View style={styles.overlay}>
          <Animated.View style={{ transform: [{ translateY: fallAnim }] }}>
            <View onLayout={(e) => setGroupHeight(e.nativeEvent.layout.height)}>
              <Animated.View
                style={{
                  transform: [
                    { translateY: -pivotShift },
                    { rotate },
                    { translateY: pivotShift },
                  ],
                }}
              >
                <View style={styles.illustrationWrap} pointerEvents="none">
                  {props.metal === false ? <RopeKnotDragon width={120} /> : <MetalHuggingRope  /> }
                </View>

                <View style={styles.tag}>
                  <View style={styles.holeDot} />

                  <Pressable
                    style={({ pressed }) => [styles.closeIcon, pressed && styles.pressed]}
                    onPress={props.closeModal}
                    hitSlop={10}
                  >
                    <Text style={styles.closeIconText}>✕</Text>
                  </Pressable>

                  {!!props.title && <Text style={styles.titleText}>{props.title}</Text>}

                  <Text style={styles.dialogText}>{props.text}</Text>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: -46, // overlaps the tag's top edge so the rope reads as threading in
  },
  tag: {
    backgroundColor: PokemonColors.cream,
    width: 300,
    maxWidth: '85%',
    minHeight: 200,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderBottomWidth: 7,
    borderBottomColor: PokemonColors.border,
    borderRadius: 20,
    padding: 24,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  holeDot: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PokemonColors.contentBackground,
    borderWidth: 3,
    borderColor: PokemonColors.border,
  },
  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    backgroundColor: PokemonColors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: PokemonColors.bodyText,
  },
  titleText: {
    fontSize: 21,
    fontWeight: '700',
    color: PokemonColors.bodyText,
    textAlign: 'center',
  },
  dialogText: {
    color: PokemonColors.bodyText,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});