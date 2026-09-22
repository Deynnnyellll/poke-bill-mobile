import { PokemonColors } from '@/constants/pokemon-theme';
import { Sounds } from '@/constants/sounds';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { clearSplitHistory, getSplitHistory } from '@/utils/split-history';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryDetailScreen() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const playTap = useSoundEffect(Sounds.tap);

  // Reload every time this screen is focused, so a newly saved split
  // shows up without needing a manual refresh.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      getSplitHistory().then((all) => {
        if (!cancelled) {
          setRecords(all);
          setLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleClear = async () => {
    await clearSplitHistory();
    setConfirmClear(false);
    setRecords([]);
    playTap();
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>PAST ENCOUNTERS</Text>
              <Text style={styles.title}>History</Text>
            </View>

            {records.length > 0 && (
              <Pressable
                onPress={() => {
                  setConfirmClear(true);
                  playTap();
                }}
                style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            )}
          </View>
        </View>

        {loading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={PokemonColors.border} />
          </View>
        )}

        {!loading && records.length === 0 && (
          <View style={styles.centerState}>
            <Text style={styles.emptyText}>No splits logged yet.</Text>
            <Text style={styles.emptySubtext}>Finish a bill and it'll show up here.</Text>
          </View>
        )}

        {!loading && records.length > 0 && (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            {records.map((item) => {
              const funder = item.members.find((m) => m.id === item.funderId);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    router.push({ pathname: '/history-record', params: { id: item.id } });
                    playTap();
                  }}
                  style={({ pressed }) => [styles.recordCard, pressed && styles.pressed]}
                >
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.recordTotal}>₱{item.total}</Text>
                  </View>

                  <Text style={styles.recordMeta}>
                    {item.items.length} item{item.items.length !== 1 ? 's' : ''} ·{' '}
                    {item.members.length} trainer{item.members.length !== 1 ? 's' : ''}
                    {funder ? ` · ${funder.name} fronted it` : ''}
                  </Text>

                  <Text style={styles.recordChevron}>View receipt →</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Two-button clear-history confirmation — the shared Modal only
          supports a single action, so this is a small custom overlay. */}
      {confirmClear && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Clear all history?</Text>
            <Text style={styles.confirmBody}>
              This removes every saved split and can't be undone.
            </Text>
            <View style={styles.confirmButtons}>
              <Pressable
                onPress={() => {
                  setConfirmClear(false);
                  playTap();
                }}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleClear}
                style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}
              >
                <Text style={styles.confirmButtonText}>Clear</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
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
  header: {
    backgroundColor: PokemonColors.navy,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: PokemonColors.yellow,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clearButton: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentInner: {
    padding: 20,
    gap: 12,
  },
  recordCard: {
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: PokemonColors.contentBackground,
    gap: 6,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordDate: {
    fontSize: 13,
    fontWeight: '700',
    color: PokemonColors.mutedText,
  },
  recordTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#C1524C',
  },
  recordMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: PokemonColors.bodyText,
  },
  recordChevron: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3E82AE',
    marginTop: 4,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: PokemonColors.bodyText,
  },
  emptySubtext: {
    fontSize: 13,
    color: PokemonColors.mutedText,
  },

  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    zIndex: 10000,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: PokemonColors.cream,
    borderWidth: 2.5,
    borderColor: PokemonColors.border,
    borderRadius: 18,
    padding: 20,
    gap: 14,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PokemonColors.bodyText,
    textAlign: 'center',
  },
  confirmBody: {
    fontSize: 14,
    color: PokemonColors.mutedText,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: PokemonColors.bodyText,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    backgroundColor: '#C1524C',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
});