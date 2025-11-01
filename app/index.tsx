import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, Music2, Sparkles, Users } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedMusicNote from '@/components/AnimatedMusicNote';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.backgroundSecondary, Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedMusicNote size={80} delay={0} x={50} y={150} />
      <AnimatedMusicNote size={60} delay={300} x={280} y={250} />
      <AnimatedMusicNote size={50} delay={600} x={150} y={450} />
      <AnimatedMusicNote size={40} delay={900} x={320} y={550} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[Colors.dark.gradient1, Colors.dark.gradient2, Colors.dark.gradient3]}
                style={styles.logoGradient}
              >
                <Music2 size={48} color={Colors.dark.text} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Festify Pro</Text>
            <Text style={styles.subtitle}>Vote, Vibe, and Control the Music Together</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.dark.gradient1 + '30' }]}>
                  <Users size={28} color={Colors.dark.gradient1} />
                </View>
                <Text style={styles.featureTitle}>Collaborative</Text>
                <Text style={styles.featureSubtitle}>Playlists</Text>
              </View>

              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.dark.gradient4 + '30' }]}>
                  <Sparkles size={28} color={Colors.dark.gradient4} />
                </View>
                <Text style={styles.featureTitle}>Real-time</Text>
                <Text style={styles.featureSubtitle}>Voting</Text>
              </View>

              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.dark.gradient3 + '30' }]}>
                  <MessageCircle size={28} color={Colors.dark.gradient3} />
                </View>
                <Text style={styles.featureTitle}>AI Buddy</Text>
                <Text style={styles.featureSubtitle}>Assistant</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/create-party' as any)}
            >
              <LinearGradient
                colors={[Colors.dark.gradient3, Colors.dark.primaryGlow]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.createButtonText}>Create Party</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.joinButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/join-party' as any)}
            >
              <Text style={styles.joinButtonText}>Join Party</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.buddyHint,
                pressed && { opacity: 0.7 },
              ]}
            >
              <MessageCircle size={20} color={Colors.dark.primary} />
              <Text style={styles.buddyHintText}>Need help planning your party?</Text>
              <Text style={styles.buddyHintSubtext}>Ask Buddy for song recommendations!</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 48,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  feature: {
    flex: 1,
    alignItems: 'center',
  },
  featureIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  buttonsContainer: {
    gap: 16,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
    letterSpacing: 0.5,
  },
  joinButton: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.cardBorder,
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buddyHint: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.card + '80',
    borderWidth: 1,
    borderColor: Colors.dark.primary + '40',
    alignItems: 'center',
    gap: 8,
  },
  buddyHintText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
  },
  buddyHintSubtext: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
