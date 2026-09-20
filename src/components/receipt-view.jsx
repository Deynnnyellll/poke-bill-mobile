import { PokemonColors } from '@/constants/pokemon-theme';
import LZString from 'lz-string';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Pure presentational — renders a finished receipt from items/members/total.
// Used by receipt.jsx (live, from AppContext) and history-detail.jsx
// (from a saved AsyncStorage record), so both look exactly the same.
export default function ReceiptView({ items, members, total }) {
  const funder = useMemo(() => members.find((m) => m.isFunder), [members]);
  const totalOwedToFunder = funder ? total - (funder.totalOwed ?? 0) : 0;
  const summaryMembers = funder ? members.filter((m) => m.id !== funder.id) : members;

  const shareUrl = useMemo(() => {
    const payload = LZString.compressToEncodedURIComponent(
      JSON.stringify({ items, members, total })
    );
    return `billsplitter://import?data=${payload}`;
  }, [items, members, total]);

  return (
    <View style={styles.wrap}>
      <View style={styles.itemList}>
        <Text style={[styles.metaText, { marginBottom: 10 }]}>
          ITEMS · {items.length} LOGGED
        </Text>
        {items.map((item) => (
          <View key={item.id}>
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₱{item.price}</Text>
            </View>
            <View style={styles.dashedBorder} />
          </View>
        ))}
      </View>

      {/* Funder banner — only rendered when someone actually fronted the bill */}
      {funder && (
        <View style={styles.funderBanner}>
          <Text style={styles.funderCrown}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.funderTitle}>{funder.name} fronted ₱{total}</Text>
            <Text style={styles.funderSubtitle}>ALREADY PAID · NO IOU</Text>
          </View>
        </View>
      )}

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>
          {funder ? `OWES ${funder.name.toUpperCase()}` : 'EACH PAYS'}
        </Text>

        {summaryMembers.map((member) => {
          const owed = member.totalOwed ?? 0;
          const fraction = total > 0 ? owed / total : 0;
          return (
            <View key={member.id} style={styles.summaryRow}>
              <View style={styles.summaryTextRow}>
                <Text style={styles.summaryName}>{member.name}</Text>
                <Text style={styles.summaryAmount}>₱{owed}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(fraction * 100, 100)}%`,
                      backgroundColor: member.type.border,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}

        {funder && (
          <View style={styles.totalOwedRow}>
            <Text style={styles.totalOwedLabel}>Total owed to {funder.name}</Text>
            <Text style={styles.totalOwedAmount}>₱{totalOwedToFunder}</Text>
          </View>
        )}
      </View>

      {/* Share stub */}
      <View style={styles.shareStub}>
        <View style={styles.shareNotchLeft} />
        <View style={styles.shareNotchRight} />
        <QRCode value={shareUrl} size={110} backgroundColor={PokemonColors.contentBackground} />
        <Text style={styles.shareLabel}>Scan with your Camera app</Text>
        <Text style={styles.shareHint}>opens straight into Bill Splitter</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  itemRow: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: PokemonColors.bodyText,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: PokemonColors.bodyText,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C1524C',
  },
  dashedBorder: {
    borderWidth: 1,
    borderColor: PokemonColors.border,
    borderStyle: 'dotted',
    borderRadius: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9A9EA8',
  },

  funderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FCF3D6',
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderRadius: 14,
    padding: 14,
  },
  funderCrown: {
    fontSize: 24,
  },
  funderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: PokemonColors.bodyText,
  },
  funderSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4C9A4C',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  summaryBox: {
    backgroundColor: PokemonColors.darkContainer,
    borderRadius: 16,
    padding: 18,
    gap: 16,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: PokemonColors.yellow,
  },
  summaryRow: {
    gap: 6,
  },
  summaryTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  totalOwedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 12,
  },
  totalOwedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: PokemonColors.yellow,
  },
  totalOwedAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: PokemonColors.yellow,
  },

  shareStub: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: PokemonColors.screenBackground,
    borderWidth: 2,
    borderColor: PokemonColors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 24,
  },
  shareNotchLeft: {
    position: 'absolute',
    left: -10,
    top: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PokemonColors.cream,
    borderWidth: 2,
    borderColor: PokemonColors.border,
  },
  shareNotchRight: {
    position: 'absolute',
    right: -10,
    top: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PokemonColors.cream,
    borderWidth: 2,
    borderColor: PokemonColors.border,
  },
  shareLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: PokemonColors.bodyText,
    marginTop: 8,
  },
  shareHint: {
    fontSize: 11,
    color: PokemonColors.mutedText ?? '#9A9EA8',
  },
});