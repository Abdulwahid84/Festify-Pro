import { LinearGradient } from 'expo-linear-gradient';
import { Music, PartyPopper, Send, Sparkles, TrendingUp, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Colors from '@/constants/colors';

interface BuddyAIModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BuddyAIModal({ visible, onClose }: BuddyAIModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>(
    []
  );

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Great question! Based on your party vibe, I recommend adding some upbeat tracks like "Blinding Lights" by The Weeknd or "Kesariya" by Arijit Singh. Want more suggestions?`,
        },
      ]);
    }, 1000);
  };

  const suggestions = [
    { icon: Music, label: 'Song recommendations', color: Colors.dark.gradient3 },
    { icon: PartyPopper, label: 'Party tips and tricks', color: Colors.dark.gradient4 },
    { icon: TrendingUp, label: 'Music trends and genres', color: Colors.dark.gradient1 },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modal}>
            <LinearGradient
              colors={[Colors.dark.card, Colors.dark.backgroundSecondary]}
              style={styles.modalContent}
            >
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <LinearGradient
                    colors={[Colors.dark.gradient1, Colors.dark.gradient3]}
                    style={styles.buddyIcon}
                  >
                    <Sparkles size={24} color={Colors.dark.text} />
                  </LinearGradient>
                  <View>
                    <Text style={styles.title}>Buddy AI</Text>
                    <Text style={styles.subtitle}>Your Party Assistant</Text>
                  </View>
                </View>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={Colors.dark.text} />
                </Pressable>
              </View>

              {messages.length === 0 && (
                <View style={styles.welcomeContainer}>
                  <LinearGradient
                    colors={[Colors.dark.gradient1, Colors.dark.gradient3]}
                    style={styles.welcomeIcon}
                  >
                    <Sparkles size={48} color={Colors.dark.text} />
                  </LinearGradient>
                  <Text style={styles.welcomeTitle}>Hey! I&apos;m Buddy 👋</Text>
                  <Text style={styles.welcomeText}>
                    Your personal party DJ assistant! Ask me about:
                  </Text>

                  <View style={styles.suggestionsContainer}>
                    {suggestions.map((item, index) => (
                      <Pressable key={index} style={styles.suggestionButton}>
                        <item.icon size={20} color={item.color} />
                        <Text style={styles.suggestionText}>{item.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {messages.length > 0 && (
                <ScrollView
                  style={styles.messagesContainer}
                  contentContainerStyle={styles.messagesContent}
                  showsVerticalScrollIndicator={false}
                >
                  {messages.map((msg, index) => (
                    <View
                      key={index}
                      style={[
                        styles.messageItem,
                        msg.role === 'user' ? styles.userMessage : styles.assistantMessage,
                      ]}
                    >
                      <Text style={styles.messageText}>{msg.content}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask Buddy anything..."
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={200}
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.sendButton,
                    pressed && { opacity: 0.7 },
                    !message.trim() && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={!message.trim()}
                >
                  <LinearGradient
                    colors={
                      message.trim()
                        ? [Colors.dark.gradient3, Colors.dark.primaryGlow]
                        : [Colors.dark.cardBorder, Colors.dark.cardBorder]
                    }
                    style={styles.sendButtonGradient}
                  >
                    <Send size={20} color={Colors.dark.text} />
                  </LinearGradient>
                </Pressable>
              </View>

              <Text style={styles.hint}>Ask Buddy for song recommendations!</Text>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  keyboardView: {
    maxHeight: '90%',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    paddingTop: 24,
    paddingBottom: 24,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buddyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 12,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  messagesContainer: {
    maxHeight: 300,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  messagesContent: {
    gap: 12,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.dark.primary,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.background,
  },
  messageText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.dark.text,
    maxHeight: 100,
  },
  sendButton: {
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  hint: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});
