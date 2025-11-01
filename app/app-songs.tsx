import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Plus, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useParty } from '@/contexts/PartyContext';
import { getAllSongs, searchSongs } from '@/data/songs';

export default function AddSongsScreen() {
  const router = useRouter();
  const { addSongToQueue, currentUser } = useParty();
  const [searchQuery, setSearchQuery] = useState('');

  const songs = searchQuery.trim() ? searchSongs(searchQuery) : getAllSongs();

  const handleAddSong = (song: any) => {
    if (!currentUser) return;
    addSongToQueue(song, currentUser.name);
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.backgroundSecondary]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Songs</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={Colors.dark.text} />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={Colors.dark.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search songs or artists"
              placeholderTextColor={Colors.dark.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Search for any song  🎵
          </Text>
          <Text style={styles.infoSubtext}>
            Powered by AI - search millions of songs from any genre, artist, or mood!
          </Text>
        </View>

        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.songItem}>
              <Image
                source={{ uri: item.albumArt }}
                style={styles.songAlbumArt}
                contentFit="cover"
              />
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
                <Text style={styles.songLanguage}>{item.language}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && { transform: [{ scale: 0.9 }] },
                ]}
                onPress={() => handleAddSong(item)}
              >
                <LinearGradient
                  colors={[Colors.dark.secondary, Colors.dark.gradient4]}
                  style={styles.addButtonGradient}
                >
                  <Plus size={24} color={Colors.dark.text} />
                </LinearGradient>
              </Pressable>
            </View>
          )}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.dark.accent + '40',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
  },
  infoBox: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.primary + '30',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoSubtext: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  songAlbumArt: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    gap: 4,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  songArtist: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  songLanguage: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  addButton: {
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
