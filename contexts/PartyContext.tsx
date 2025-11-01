import createContextHook from '@nkzw/create-context-hook';
import { Audio } from 'expo-av';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Member, Party, Song } from '@/types';

function generatePartyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const [PartyProvider, useParty] = createContextHook(() => {
  const [currentParty, setCurrentParty] = useState<Party | null>(null);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showBuddyModal, setShowBuddyModal] = useState(false);
  const [showVisualizerModal, setShowVisualizerModal] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const createParty = useCallback(
    (title: string, hostName: string, city?: string, date?: string, time?: string) => {
      const code = generatePartyCode();
      const host: Member = {
        id: Date.now().toString(),
        name: hostName,
        isHost: true,
        joinedAt: Date.now(),
      };

      const newParty: Party = {
        id: Date.now().toString(),
        code,
        title,
        city,
        date,
        time,
        hostId: host.id,
        hostName: host.name,
        createdAt: Date.now(),
        members: [host],
        queue: [],
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
      };

      setCurrentParty(newParty);
      setCurrentUser(host);
      console.log('Party created:', code);
      return code;
    },
    []
  );

  const joinParty = useCallback((code: string, userName: string) => {
    const member: Member = {
      id: Date.now().toString(),
      name: userName,
      isHost: false,
      joinedAt: Date.now(),
    };

    setCurrentParty((prev) => {
      if (!prev || prev.code !== code) {
        console.log('Creating demo party for code:', code);
        return {
          id: Date.now().toString(),
          code,
          title: 'Party Night',
          hostId: 'demo-host',
          hostName: 'DJ Master',
          createdAt: Date.now(),
          members: [member],
          queue: [],
          currentSong: null,
          isPlaying: false,
          currentTime: 0,
        };
      }

      return {
        ...prev,
        members: [...prev.members, member],
      };
    });

    setCurrentUser(member);
    console.log('Joined party:', code);
    return true;
  }, []);

  const leaveParty = useCallback(() => {
    setCurrentParty(null);
    setCurrentUser(null);
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setCurrentTime(0);
    console.log('Left party');
  }, [sound]);

  const addSongToQueue = useCallback((song: Song, userName: string) => {
    setCurrentParty((prev) => {
      if (!prev) return prev;

      const songWithUser = {
        ...song,
        addedBy: userName,
        addedAt: Date.now(),
        votes: 0,
      };

      return {
        ...prev,
        queue: [...prev.queue, songWithUser],
      };
    });
    console.log('Added song to queue:', song.title);
  }, []);

  const voteSong = useCallback((songId: string, increment: boolean) => {
    setCurrentParty((prev) => {
      if (!prev) return prev;

      const updatedQueue = prev.queue
        .map((song) =>
          song.id === songId
            ? { ...song, votes: Math.max(0, song.votes + (increment ? 1 : -1)) }
            : song
        )
        .sort((a, b) => b.votes - a.votes);

      return {
        ...prev,
        queue: updatedQueue,
      };
    });
  }, []);

  const playNextSong = useCallback(async () => {
    if (!currentParty || currentParty.queue.length === 0) {
      setCurrentParty((prev) => (prev ? { ...prev, currentSong: null, isPlaying: false } : prev));
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      return;
    }

    const nextSong = currentParty.queue[0];
    setCurrentParty((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        queue: prev.queue.slice(1),
        currentSong: nextSong,
        isPlaying: true,
        currentTime: 0,
      };
    });

    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    try {
      console.log('Playing next song:', nextSong.title);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: nextSong.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.positionMillis !== undefined) {
          setCurrentTime(status.positionMillis / 1000);
          if (status.didJustFinish) {
            playNextSong();
          }
        }
      });
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }, [currentParty, sound]);

  const togglePlayPause = useCallback(async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
      console.log('Paused');
    } else {
      await sound.playAsync();
      setIsPlaying(true);
      console.log('Playing');
    }

    setCurrentParty((prev) => (prev ? { ...prev, isPlaying: !isPlaying } : prev));
  }, [sound, isPlaying]);

  const skipSong = useCallback(() => {
    playNextSong();
    console.log('Skipped song');
  }, [playNextSong]);

  const isHost = currentUser?.isHost ?? false;

  return useMemo(
    () => ({
      currentParty,
      currentUser,
      isHost,
      isPlaying,
      currentTime,
      showMembersModal,
      showBuddyModal,
      showVisualizerModal,
      createParty,
      joinParty,
      leaveParty,
      addSongToQueue,
      voteSong,
      playNextSong,
      togglePlayPause,
      skipSong,
      setShowMembersModal,
      setShowBuddyModal,
      setShowVisualizerModal,
    }),
    [
      currentParty,
      currentUser,
      isHost,
      isPlaying,
      currentTime,
      showMembersModal,
      showBuddyModal,
      showVisualizerModal,
      createParty,
      joinParty,
      leaveParty,
      addSongToQueue,
      voteSong,
      playNextSong,
      togglePlayPause,
      skipSong,
      setShowMembersModal,
      setShowBuddyModal,
      setShowVisualizerModal,
    ]
  );
});
