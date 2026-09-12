import useTyper from '@/hooks/useTyper';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenFooter from '@/components/screen-footer';
import ScreenHeader from '@/components/screen-header';

const MEMBER_TYPES = [
  { label: 'Grass', bg: '#B7E4B0', border: '#4C9A4C', text: '#2F6B2F' },
  { label: 'Fire', bg: '#F5A3A0', border: '#C1524C', text: '#8A2F2A' },
  { label: 'Water', bg: '#A9D9F2', border: '#3E82AE', text: '#2A5A78' },
];

export default function PartyScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]);

  const DIALOG_TEXT = "Who's in the party? Everyone gets a type colour.";
  const TYPE_SPEED_MS = 30;

  const typeDialogText = useTyper(DIALOG_TEXT, TYPE_SPEED_MS);

  const addMember = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const type = MEMBER_TYPES[members.length % MEMBER_TYPES.length];
    setMembers((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, name: trimmed, type }]);
    setName('');
  };

  const removeMember = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <ScreenHeader
          eyebrow="STEP 1 / 6"
          eyebrowMuted="BILL NOT LOGGED YET"
          title="Who's in the party?"
          currentStep={1}
        />

        <View style={styles.dialogBox}>
          <Text style={styles.dialogText}>{typeDialogText}</Text>
          <Text style={styles.dialogArrow}>▼</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name..."
              placeholderTextColor="#9A9EA8"
              returnKeyType="done"
              onSubmitEditing={addMember}
            />
            <Pressable
              onPress={addMember}
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.metaText}>PARTY · {members.length} MEMBERS</Text>

          <View style={styles.memberList}>
            {members.map((member, index) => (
              <View key={member.id} style={styles.memberRow}>
                <View
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: member.type.border },
                  ]}>
                  <Text style={styles.memberAvatarText}>{index + 1}</Text>
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <View
                  style={[
                    styles.memberBadge,
                    { backgroundColor: member.type.bg, borderColor: member.type.border },
                  ]}>
                  <Text style={[styles.memberBadgeText, { color: member.type.text }]}>
                    {member.type.label}
                  </Text>
                </View>
                <Pressable
                  onPress={() => removeMember(member.id)}
                  style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}>
                  <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <ScreenFooter
          nextLabel="Next"
          onNext={() => router.push('/log')}
          onBack={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

const CREAM = '#FBF6E3';
const BORDER = '#1A1A1A';
const YELLOW = '#F5C445';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },
  card: {
    flex: 1,
    backgroundColor: CREAM,
  },
  dialogBox: {
    backgroundColor: '#FCF3D6',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 3,
    borderBottomColor: BORDER,
  },
  dialogText: {
    color: '#2A2A2A',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  dialogArrow: {
    position: 'absolute',
    right: 20,
    bottom: 8,
    color: '#C1524C',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 14,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2A2A2A',
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    width: 48,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: BORDER,
  },
  metaText: {
    color: '#7A7E88',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  memberList: {
    gap: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  memberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  memberBadge: {
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  removeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: BORDER,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
