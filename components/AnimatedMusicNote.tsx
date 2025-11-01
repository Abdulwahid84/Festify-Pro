import { Music } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface AnimatedMusicNoteProps {
  size?: number;
  delay?: number;
  x: number;
  y: number;
}

export default function AnimatedMusicNote({ size = 40, delay = 0, x, y }: AnimatedMusicNoteProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 1000 + delay,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000 + delay,
          useNativeDriver: true,
        }),
      ])
    );

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000 + delay * 2,
        useNativeDriver: true,
      })
    );

    const opacity = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => {
      bounce.start();
      rotate.start();
      opacity.start();
    }, delay);

    return () => {
      bounce.stop();
      rotate.stop();
      opacity.stop();
    };
  }, [bounceAnim, rotateAnim, opacityAnim, delay]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.note,
        {
          left: x,
          top: y,
          transform: [{ translateY: bounceAnim }, { rotate: spin }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Music size={size} color={Colors.dark.primary} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  note: {
    position: 'absolute',
  },
});
