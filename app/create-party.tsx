import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useParty } from '@/contexts/PartyContext';

export default function CreatePartyScreen() {
  const router = useRouter();
  const { createParty } = useParty();
  const [partyName, setPartyName] = useState('');
  const [yourName, setYourName] = useState('');

  const handleCreateParty = () => {
    if (!partyName.trim() || !yourName.trim()) return;

    const code = createParty(partyName.trim(), yourName.trim());
    console.log('Party created with code:', code);
    router.replace('/party' as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.backgroundSecondary]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.dark.text} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[Colors.dark.gradient1, Colors.dark.accent]}
              style={styles.iconGradient}
            >
              <Sparkles size={40} color={Colors.dark.text} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Create Party</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Party Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Friday Night Vibes"
                placeholderTextColor={Colors.dark.textSecondary}
                value={partyName}
                onChangeText={setPartyName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="DJ Master"
                placeholderTextColor={Colors.dark.textSecondary}
                value={yourName}
                onChangeText={setYourName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.infoBox}>
              <LinearGradient
                colors={[Colors.dark.gradient1 + '20', Colors.dark.gradient3 + '20']}
                style={styles.infoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.infoText}>
                  As the host, you&apos;ll have control over playback and can manage the queue. Share
                  the party code with guests to let them join and vote!
                </Text>
              </LinearGradient>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.buttonPressed,
                (!partyName.trim() || !yourName.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleCreateParty}
              disabled={!partyName.trim() || !yourName.trim()}
            >
              <LinearGradient
                colors={
                  !partyName.trim() || !yourName.trim()
                    ? [Colors.dark.cardBorder, Colors.dark.cardBorder]
                    : [Colors.dark.gradient3, Colors.dark.primaryGlow]
                }
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.createButtonText}>Start the Party</Text>
              </LinearGradient>
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderWidth: 2,
    borderColor: Colors.dark.cardBorder,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.dark.text,
  },
  infoBox: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.primary + '30',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  createButton: {
    marginTop: 16,
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
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
