import { AppContext } from '@/context/context';
import useTyper from '@/hooks/useTyper';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenFooter from '@/components/screen-footer';
import ScreenHeader from '@/components/screen-header';
import { PokemonColors } from '@/constants/pokemon-theme';

import Modal from '@/components/modal';
import ReceiptView from '@/components/receipt-view';
import { clearDraft } from '@/utils/split-draft';
import { saveSplitToHistory } from '@/utils/split-history';

export default function AssignScreen() {
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [isReceiptModal, setIsReceiptModal] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    items,
    members,
    total,
    assignments,
    itemFunders,
    setItems,
    setMembers,
    setAssignments,
    setItemFunders,
    setTotal,
    setSplitCompleted,
  } = useContext(AppContext);

  const DIALOG_TEXT = 'Everyone share is set. You can tap share to send it around.';
  const TYPE_SPEED_MS = 30;

  const typeDialogText = useTyper(DIALOG_TEXT, TYPE_SPEED_MS);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const result = await saveSplitToHistory({ items, members, total, assignments, itemFunders });
    setSaving(false);

    // saveSplitToHistory returns the saved record on success, or null if the
    // write failed (e.g. AsyncStorage not linked) — only claim success when
    // it actually returned something.
    if (result) {
      setIsReceiptModal(true);
      console.log('[receipt] save result:', result);
    } else {
      setSaveFailed(true);
    }
  };

  const closeReceiptModal = () => {
    setIsReceiptModal(false);
    setTimeout(() => {
      clearDraft();
      setTotal(0);
      setMembers([]);
      setItems([]);
      setAssignments({});
      setItemFunders({});
      setSplitCompleted(true);
      router.push("./");
    }, 500);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <ScreenHeader
          eyebrow="STEP 5 / 5"
          eyebrowMuted={'BILL LOGGED'}
          title="Here's your receipt"
          currentStep={5}
        />

        <View style={styles.dialogBox}>
          <Text style={styles.dialogText}>{typeDialogText}</Text>
          <Text style={styles.dialogArrow}>▼</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          <ReceiptView
            items={items}
            members={members}
            total={total}
            assignments={assignments}
            itemFunders={itemFunders}
          />
        </ScrollView>

        <ScreenFooter
          nextLabel={saving ? 'Saving…' : 'Save the receipt'}
          onNext={handleSave}
          onBack={() => router.back()}
        />
      </View>

      <Modal
        text="Every item needs at least one person tagged before you can see the receipt."
        isModal={isModal}
        metal={false}
        closeModal={() => setIsModal(false)}
      />

      <Modal
        text="Receipt saved."
        isModal={isReceiptModal}
        metal={true}
        closeModal={closeReceiptModal}
      />

      <Modal
        text="Couldn't save the receipt. Check your connection to local storage and try again."
        isModal={saveFailed}
        metal={false}
        closeModal={() => setSaveFailed(false)}
      />
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
    backgroundColor: '#FFFFFF',
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});