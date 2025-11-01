import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';

interface MusicVisualizerProps {
  visible: boolean;
  onClose: () => void;
  isPlaying: boolean;
}

function VisualizerBar({ delay, isPlaying }: { delay: number; isPlaying: boolean }) {
  const heightAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!isPlaying) {
      Animated.timing(heightAnim, {
        toValue: 20,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return;
    }

    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(heightAnim, {
            toValue: Math.random() * 120 + 40,
            duration: 300 + Math.random() * 200,
            useNativeDriver: false,
          }),
          Animated.timing(heightAnim, {
            toValue: Math.random() * 120 + 40,
            duration: 300 + Math.random() * 200,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    setTimeout(animate, delay);

    return () => {
      heightAnim.stopAnimation();
    };
  }, [isPlaying, heightAnim, delay]);

  return <Animated.View style={[styles.bar, { height: heightAnim }]} />;
}

export default function MusicVisualizer({ visible, onClose, isPlaying }: MusicVisualizerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient
          colors={[Colors.dark.background + 'F0', Colors.dark.backgroundSecondary + 'F0']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.header}>
          <Text style={styles.title}>Music Visualizer</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={28} color={Colors.dark.text} />
          </Pressable>
        </View>

        <View style={styles.visualizerContainer}>
          <View style={styles.barsContainer}>
            {Array.from({ length: 20 }).map((_, i) => (
              <VisualizerBar key={i} delay={i * 50} isPlaying={isPlaying} />
            ))}
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isPlaying && styles.statusDotActive]} />
          <Text style={styles.statusText}>{isPlaying ? 'Playing' : 'Paused'}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 22,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    height: 200,
  },
  bar: {
    width: 8,
    backgroundColor: Colors.dark.primary,
    borderRadius: 4,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.textSecondary,
  },
  statusDotActive: {
    backgroundColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
});
