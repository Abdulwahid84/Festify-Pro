import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import type { Member } from '@/types';

interface PartyMembersModalProps {
  visible: boolean;
  onClose: () => void;
  members: Member[];
  songsInQueue: number;
}

export default function PartyMembersModal({
  visible,
  onClose,
  members,
  songsInQueue,
}: PartyMembersModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modal}>
          <LinearGradient
            colors={[Colors.dark.card, Colors.dark.backgroundSecondary]}
            style={styles.modalContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Party Members</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.dark.text} />
              </Pressable>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{members.length}</Text>
                <Text style={styles.statLabel}>Total Members</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{songsInQueue}</Text>
                <Text style={styles.statLabel}>Songs in Queue</Text>
              </View>
            </View>

            <View style={styles.membersList}>
              {members.map((member) => (
                <View key={member.id} style={styles.memberItem}>
                  <LinearGradient
                    colors={
                      member.isHost
                        ? [Colors.dark.gradient1, Colors.dark.accent]
                        : [Colors.dark.gradient3, Colors.dark.gradient2]
                    }
                    style={styles.avatar}
                  >
                    {member.isHost ? (
                      <Crown size={24} color={Colors.dark.text} />
                    ) : (
                      <Text style={styles.avatarText}>{member.name[0].toUpperCase()}</Text>
                    )}
                  </LinearGradient>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.isHost && <Text style={styles.hostBadge}>Host</Text>}
                    <Text style={styles.joinedTime}>Just now</Text>
                  </View>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
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
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
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
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: Colors.dark.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.dark.cardBorder,
    marginHorizontal: 16,
  },
  membersList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  hostBadge: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.dark.accent,
    backgroundColor: Colors.dark.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  joinedTime: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
});
