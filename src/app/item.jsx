import { AppContext } from '@/context/context';
import useTyper from '@/hooks/useTyper';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenFooter from '@/components/screen-footer';
import ScreenHeader from '@/components/screen-header';
import { PokemonColors } from '@/constants/pokemon-theme';

import Modal from '@/components/modal';


export default function ItemScreen() {
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [isModal, setIsModal] = useState(false);
  
  const { items, setItems, total, setTotal } = useContext(AppContext);

  const DIALOG_TEXT = "Add every line on the bill. Prices get split next.";
  const TYPE_SPEED_MS = 30;

  const typeDialogText = useTyper(DIALOG_TEXT, TYPE_SPEED_MS);

  const addItem = () => {
    const trimmedName = itemName.trim();
    if (!trimmedName) return;

    const parsedPrice = parseFloat(price);
    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) return;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    setItems((prev) => [...prev, { id, name: trimmedName, price: parsedPrice }]);
    setItemName('');
    setPrice('');
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <ScreenHeader
          eyebrow="STEP 2 / 5"
          eyebrowMuted={items.length === 0 ? "BILL NOT LOGGED YET" : `P${total.toFixed(0)} Bill`}
          title="What did we get?"
          currentStep={2}
        />

        <View style={styles.dialogBox}>
          <Text style={styles.dialogText}>{typeDialogText}</Text>
          <Text style={styles.dialogArrow}>▼</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputName}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Item name..."
              placeholderTextColor="#9A9EA8"
              returnKeyType="done"
              onSubmitEditing={addItem}
            />
            <TextInput
              style={styles.inputPrice}
              value={price}
              onChangeText={setPrice}
              placeholder="₱0"
              placeholderTextColor="#9A9EA8"
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={addItem}
            />
            <Pressable
              onPress={addItem}
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.metaText}>ITEMS · {items.length} LOGGED</Text>

          <View style={styles.memberList}>
            {items.map((item, index) => (
              <View key={item.id} style={styles.memberRow}>
                <View style={styles.itemNumberCont}>
                  <Text style={styles.itemNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.priceText}>₱{item.price.toFixed(2)}</Text>
                <Pressable
                  onPress={() => removeItem(item.id)}
                  style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}>
                  <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>BILL TOTAL</Text>
            <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
          </View>
        </View>

        <ScreenFooter
          nextLabel="Next"
          onNext={items.length === 0 ? () => setIsModal(prev => !prev) : () => router.push('/assign')}
          onBack={() => router.back()}
        />
      </View>

      <Modal text={"Please enter items"} isModal={isModal} closeModal={() => setIsModal(prev => !prev)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: PokemonColors.cream,
  },
  card: {
    flex: 1,
    width: '100%',
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
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 14,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  inputName: {
    flex: 1,
    minWidth: 0,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2A2A2A',
    backgroundColor: '#FFFFFF',
  },
  inputPrice: {
    flex: 0.5,
    minWidth: 0,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2A2A2A',
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    width: 48,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 12,
    backgroundColor: PokemonColors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 22,
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
  itemNumberCont: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PokemonColors.yellow,
    borderWidth: 2,
    borderColor: PokemonColors.border
  },
  itemNumber: {
    color: PokemonColors.border,
    fontSize: 13,
    fontWeight: '800'
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PokemonColors.darkContainer,
    paddingTop: 14,
    marginTop: 4,
    padding: 14,
    borderRadius: 15
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: PokemonColors.yellow,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: "#FFFFFF",
  },
  removeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: PokemonColors.border,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});