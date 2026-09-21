import { AppContext } from '@/context/context';
import useTyper from '@/hooks/useTyper';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenFooter from '@/components/screen-footer';
import ScreenHeader from '@/components/screen-header';
import { PokemonColors } from '@/constants/pokemon-theme';

import Modal from '@/components/modal';

export default function ItemScreen() {
  const router = useRouter();
  
  const { members, setMembers } = useContext(AppContext);
  const [isFunder, setIsFunder] = useState(null);
  const [isModal, setIsModal] = useState(false);

  const DIALOG_TEXT = "Did anyone front the cash for the table?";
  const TYPE_SPEED_MS = 30;

  const typeDialogText = useTyper(DIALOG_TEXT, TYPE_SPEED_MS);

  const handleFunder = (id) => {
    if(isFunder) {
      setMembers((prev) => prev.map(item => item.id === id ? {...item, isFunder: true} : {...item, isFunder: false}))
    }
  }

  const handleSplitEvenly = () => {
    setMembers((prev) => prev.map(item => item.id && {...item, isFunder: false}))
    setIsFunder(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <ScreenHeader
          eyebrow="STEP 3 / 5"
          eyebrowMuted="BILL NOT LOGGED YET"
          title="Who frontend the cash?"
          currentStep={3}
        />

        <View style={styles.dialogBox}>
          <Text style={styles.dialogText}>{typeDialogText}</Text>
          <Text style={styles.dialogArrow}>▼</Text>
        </View>

        <ScrollView style={{backgroundColor: "#FFF"}}>
          <View style={styles.content}>
            <View style={styles.optionRow}>
              <Pressable
                onPress={() => setIsFunder(true)}
                style={[styles.option, isFunder === true ? styles.pressed : styles.notPressed]}>
                <Text style={styles.optionText}>One Person Paid</Text>
              </Pressable>

              <Pressable
                onPress={handleSplitEvenly}
                style={[styles.option, isFunder === false ? styles.pressed : styles.notPressed]}>
                <Text style={styles.optionText}>Split Evenly</Text>
              </Pressable>
            </View>

            <Text style={styles.metaText}>PICK THE FUNDER</Text>

            <View style={styles.memberList}>
              {members.map((member, index) => (
                <Pressable key={member.id} style={({ pressed }) => [styles.memberRow, pressed && styles.selectedFunder]} onPress={() => handleFunder(member.id)}>
                  <View
                    style={[
                      styles.memberAvatar,
                      { backgroundColor: member.type.border }
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
                </Pressable>
              ))}
            </View>
            {
              isFunder === true &&
              members.map(item => (
                item.isFunder === true &&

                <View key={item.id} style={[styles.memberRow, {backgroundColor: PokemonColors.darkContainer, paddingVertical: 20}]}>
                  <View
                    style={[
                      styles.memberAvatar,
                      { backgroundColor: PokemonColors.yellow },
                    ]}>
                    <Text style={styles.memberAvatarText}>★</Text>
                  </View>

                  <Text style={styles.funderName}>{item.name}</Text>
              </View>
              ))
            }
          </View>
        </ScrollView>

        <ScreenFooter
          nextLabel="Next"
          onNext={isFunder === null ? () => setIsModal(prev => !prev) : () => router.push('/split')}
          onBack={() => router.back()}
        />
      </View>

      <Modal text={"Please select an option"} isModal={isModal} closeModal={() => setIsModal(prev => !prev)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PokemonColors.cream,
  },
  card: {
    flex: 1,
    backgroundColor: PokemonColors.cream,
  },
  dialogBox: {
    backgroundColor: '#FCF3D6',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 3,
    borderBottomColor: PokemonColors.border,
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
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 12,
    backgroundColor: "#FFFFF",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 5
  },
  optionText: {
    fontSize: 16,
    fontWeight: '800',
    color: PokemonColors.border,
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
    borderColor: PokemonColors.border,
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
    borderWidth: 2,
    borderColor: PokemonColors.border
  },
  memberAvatarText: {
    color: PokemonColors.bodyText,
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
  funderName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 800
  },
  pressed: {
    backgroundColor: PokemonColors.yellow
  },
  notPressed: {
    backgroundColor: "#FFFFFF"
  },
  selectedFunder: {
    backgroundColor: PokemonColors.yellow,
    opacity: 0.8
  }
});
