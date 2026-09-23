import { PokemonColors } from '@/constants/pokemon-theme';
import LZString from 'lz-string';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Pure presentational — renders a finished receipt from items/members/total.
// Used by receipt.jsx (live, from AppContext) and history-detail.jsx
// (from a saved AsyncStorage record), so both look exactly the same.
//
// `assignments` ({ [itemId]: memberId[] }, who shared each item) and
// `itemFunders` ({ [itemId]: funderId }, who paid for each item) are optional:
// records saved before multi-funder support won't have them, in which case a
// single funder's precomputed `totalOwed` is used as a fallback.
export default function ReceiptView({ items, members, total, assignments, itemFunders }) {
  const funders = useMemo(() => members.filter((m) => m.isFunder), [members]);
  const hasItemFunderMap = !!itemFunders && Object.keys(itemFunders).length > 0;

  // Debt ledger: { [sharerId]: { [funderId]: amount } } — what each
  // non-funder member owes, broken down by which funder paid for the items
  // they consumed.
  const debts = useMemo(() => {
    const map = {};
    if (funders.length === 0) return map;

    if (hasItemFunderMap && assignments) {
      items.forEach((item) => {
        const funderId = itemFunders[item.id];
        if (!funderId) return;
        const sharers = assignments[item.id] ?? [];
        if (sharers.length === 0) return;
        const each = item.price / sharers.length;
        sharers.forEach((sharerId) => {
          if (sharerId === funderId) return;
          map[sharerId] = map[sharerId] || {};
          map[sharerId][funderId] = (map[sharerId][funderId] ?? 0) + each;
        });
      });
    } else if (funders.length === 1) {
      const [only] = funders;
      members.forEach((member) => {
        if (member.id === only.id) return;
        map[member.id] = { [only.id]: member.totalOwed ?? 0 };
      });
    }

    return map;
  }, [items, assignments, itemFunders, funders, hasItemFunderMap, members]);

  const amountFundedBy = useMemo(() => {
    const map = {};
    funders.forEach((f) => { map[f.id] = 0; });
    if (hasItemFunderMap) {
      items.forEach((item) => {
        const funderId = itemFunders[item.id];
        if (funderId && map[funderId] != null) map[funderId] += item.price;
      });
    } else if (funders.length === 1) {
      map[funders[0].id] = total;
    }
    return map;
  }, [items, itemFunders, funders, hasItemFunderMap, total]);

  const totalOwedByFunder = useMemo(() => {
    const map = {};
    funders.forEach((f) => { map[f.id] = 0; });
    Object.values(debts).forEach((owedTo) => {
      Object.entries(owedTo).forEach(([funderId, amount]) => {
        map[funderId] = (map[funderId] ?? 0) + amount;
      });
    });
    return map;
  }, [debts, funders]);

  const summaryMembers = funders.length > 0
    ? members.filter((m) => !funders.some((f) => f.id === m.id))
    : members;

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

      {/* Funder banner(s) — only rendered when someone actually fronted the bill */}
      {funders.map((f) => (
        <View key={f.id} style={styles.funderBanner}>
          <Text style={styles.funderCrown}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.funderTitle}>{f.name} fronted ₱{amountFundedBy[f.id] ?? 0}</Text>
            <Text style={styles.funderSubtitle}>ALREADY PAID · NO IOU</Text>
          </View>
        </View>
      ))}

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>
          {funders.length === 0
            ? 'EACH PAYS'
            : funders.length === 1
              ? `OWES ${funders[0].name.toUpperCase()}`
              : 'WHO OWES WHOM'}
        </Text>

        {summaryMembers.map((member) => {
          const memberDebts = debts[member.id] ?? {};
          const owed = funders.length > 0
            ? Object.values(memberDebts).reduce((sum, amount) => sum + amount, 0)
            : (member.totalOwed ?? 0);
          const fraction = total > 0 ? owed / total : 0;
          return (
            <View key={member.id} style={styles.summaryRow}>
              <View style={styles.summaryTextRow}>
                <Text style={styles.summaryName}>{member.name}</Text>
                <Text style={styles.summaryAmount}>₱{owed}</Text>
              </View>
              {funders.length > 1 && Object.keys(memberDebts).length > 0 && (
                <View style={{ gap: 2 }}>
                  {Object.entries(memberDebts).map(([funderId, amount]) => {
                    const owedFunder = members.find((m) => m.id === funderId);
                    return (
                      <Text key={funderId} style={styles.summarySubtext}>
                        ₱{amount} to {owedFunder?.name ?? 'unknown'}
                      </Text>
                    );
                  })}
                </View>
              )}
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

        {funders.map((f) => (
          <View key={f.id} style={styles.totalOwedRow}>
            <Text style={styles.totalOwedLabel}>Total owed to {f.name}</Text>
            <Text style={styles.totalOwedAmount}>₱{totalOwedByFunder[f.id] ?? 0}</Text>
          </View>
        ))}
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
  summarySubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
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