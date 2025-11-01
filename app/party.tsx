import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ChevronUp,
  Copy,
  Eye,
  MessageCircle,
  Pause,
  Play,
  Share2,
  SkipForward,
  Users,
} from 'lucide-react-native';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import BuddyAIModal from '@/components/BuddyAIModal';
import MusicVisualizer from '@/components/MusicVisualizer';
import PartyMembersModal from '@/components/PartyMembersModal';
import Colors from '@/constants/colors';
import { useParty } from '@/contexts/PartyContext';
import { useState } from 'react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PartyScreen() {
  const router = useRouter();
  const {
    currentParty,
    currentUser,
    isHost,
    isPlaying,
    currentTime,
    leaveParty,
    togglePlayPause,
    skipSong,
    voteSong,
    showMembersModal,
    showBuddyModal,
    showVisualizerModal,
    setShowMembersModal,
    setShowBuddyModal,
    setShowVisualizerModal,
  } = useParty();
  const [copiedCode, setCopiedCode] = useState(false);

  if (!currentParty || !currentUser) {
    router.replace('/');
    return null;
  }

  const handleCopyCode = async () => {
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(currentParty.code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = async () => {
    const message = `🎉 Join my party on Festify Pro!\nParty: ${currentParty.title}\nCode: ${currentParty.code}\nClick here to join: https://festifypro.app/join/${currentParty.code}`;

    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: 'Join My Party',
          text: message,
        });
      }
    } else {
      await Sharing.shareAsync(message);
    }
  };

  const handleLeaveParty = () => {
    leaveParty();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.backgroundSecondary, Colors.dark.background]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.partyTitle}>{currentParty.title}</Text>
            <Pressable style={styles.codeButton} onPress={handleCopyCode}>
              <Text style={styles.codeText}>{currentParty.code}</Text>
              <Copy size={16} color={Colors.dark.primary} />
            </Pressable>
            {copiedCode && <Text style={styles.copiedText}>Copied!</Text>}
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton} onPress={() => setShowMembersModal(true)}>
              <Users size={24} color={Colors.dark.text} />
              {currentParty.members.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{currentParty.members.length}</Text>
                </View>
              )}
            </Pressable>
            <Pressable style={styles.iconButton} onPress={handleShare}>
              <Share2 size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentParty.currentSong && (
            <View style={styles.nowPlayingCard}>
              <Image
                source={{ uri: currentParty.currentSong.albumArt }}
                style={styles.albumArt}
                contentFit="cover"
              />
              <Text style={styles.songTitle}>{currentParty.currentSong.title}</Text>
              <Text style={styles.artistName}>{currentParty.currentSong.artist}</Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(currentTime / currentParty.currentSong.duration) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>
                    {formatTime(currentParty.currentSong.duration)}
                  </Text>
                </View>
              </View>

              {isPlaying && (
                <Pressable
                  style={styles.pausedIndicator}
                  onPress={() => setShowVisualizerModal(true)}
                >
                  <Eye size={20} color={Colors.dark.primary} />
                  <Text style={styles.pausedText}>Visualizer</Text>
                </Pressable>
              )}

              {!isPlaying && (
                <View style={styles.pausedIndicator}>
                  <View style={styles.pausedDot} />
                  <Text style={styles.pausedText}>Paused</Text>
                </View>
              )}
            </View>
          )}

          {!currentParty.currentSong && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No song playing</Text>
              <Text style={styles.emptySubtext}>Add songs to start the party!</Text>
            </View>
          )}

          {isHost && (
            <View style={styles.controlsCard}>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
                onPress={togglePlayPause}
              >
                <LinearGradient
                  colors={[Colors.dark.primary, Colors.dark.primaryGlow]}
                  style={styles.playButtonGradient}
                >
                  {isPlaying ? (
                    <Pause size={32} color={Colors.dark.background} fill={Colors.dark.background} />
                  ) : (
                    <Play size={32} color={Colors.dark.background} fill={Colors.dark.background} />
                  )}
                </LinearGradient>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.skipButton,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
                onPress={skipSong}
              >
                <SkipForward size={28} color={Colors.dark.text} />
              </Pressable>
            </View>
          )}

          <View style={styles.queueHeader}>
            <Text style={styles.queueTitle}>Up Next</Text>
            <Pressable
              style={styles.addSongButton}
              onPress={() => router.push('/add-songs' as any)}
            >
              <Text style={styles.addSongText}>+ Add Song</Text>
            </Pressable>
          </View>

          {currentParty.queue.length === 0 && (
            <View style={styles.emptyQueue}>
              <Text style={styles.emptyQueueText}>Queue is empty</Text>
              <Text style={styles.emptyQueueSubtext}>Add songs to keep the party going!</Text>
            </View>
          )}

          {currentParty.queue.map((song, index) => (
            <View key={song.id} style={styles.queueItem}>
              <Image
                source={{ uri: song.albumArt }}
                style={styles.queueAlbumArt}
                contentFit="cover"
              />
              <View style={styles.queueInfo}>
                <Text style={styles.queueSongTitle} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={styles.queueArtistName} numberOfLines={1}>
                  {song.artist}
                </Text>
                <Text style={styles.queueAddedBy}>Added by {song.addedBy}</Text>
              </View>
              <View style={styles.voteContainer}>
                <Pressable
                  style={styles.voteButton}
                  onPress={() => voteSong(song.id, true)}
                >
                  <ChevronUp size={20} color={Colors.dark.primary} />
                </Pressable>
                <Text style={styles.voteCount}>{song.votes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.leaveButton} onPress={handleLeaveParty}>
            <Text style={styles.leaveButtonText}>Leave Party</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Pressable
        style={styles.floatingBuddyButton}
        onPress={() => setShowBuddyModal(true)}
      >
        <LinearGradient
          colors={[Colors.dark.secondary, Colors.dark.gradient4]}
          style={styles.floatingBuddyGradient}
        >
          <MessageCircle size={28} color={Colors.dark.text} fill={Colors.dark.text} />
        </LinearGradient>
      </Pressable>

      <PartyMembersModal
        visible={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={currentParty.members}
        songsInQueue={currentParty.queue.length}
      />

      <MusicVisualizer
        visible={showVisualizerModal}
        onClose={() => setShowVisualizerModal(false)}
        isPlaying={isPlaying}
      />

      <BuddyAIModal
        visible={showBuddyModal}
        onClose={() => setShowBuddyModal(false)}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  partyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.primary + '40',
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.primary,
    letterSpacing: 1,
  },
  copiedText: {
    fontSize: 12,
    color: Colors.dark.success,
    fontWeight: '600' as const,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.dark.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nowPlayingCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  pausedIndicator: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.dark.background,
    borderRadius: 20,
  },
  pausedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.error,
  },
  pausedText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '600' as const,
  },
  emptyCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    padding: 48,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  controlsCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  playButton: {
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  queueTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  addSongButton: {
    backgroundColor: Colors.dark.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addSongText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  emptyQueue: {
    padding: 32,
    alignItems: 'center',
  },
  emptyQueueText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  emptyQueueSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  queueAlbumArt: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  queueInfo: {
    flex: 1,
    gap: 4,
  },
  queueSongTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  queueArtistName: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  queueAddedBy: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  voteContainer: {
    alignItems: 'center',
    gap: 4,
  },
  voteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.background,
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  footer: {
    padding: 24,
    paddingBottom: 16,
  },
  leaveButton: {
    backgroundColor: Colors.dark.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  floatingBuddyButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  floatingBuddyGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
