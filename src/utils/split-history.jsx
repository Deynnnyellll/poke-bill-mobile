// utils/splitHistory.js
// Persists finished splits to device storage so they survive app restarts.
//
// Requires:
//   npx expo install @react-native-async-storage/async-storage

import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'bill-splitter:history';

/**
 * Returns all saved splits, newest first.
 * @returns {Promise<Array<{id: string, date: string, total: number, members: object[], items: object[], funderId: string|null}>>}
 */
export async function getSplitHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    console.log('[splitHistory] raw value:', raw);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.warn('Failed to read split history:', err);
    return [];
  }
}

/**
 * Appends a finished split to history. Call this once, when a split is
 * actually finalized (e.g. when the receipt screen first renders with
 * a complete set of items and assignments) — not on every render.
 * @param {{ items: object[], members: object[], total: number, assignments: object, itemFunders: object }} split
 */
export async function saveSplitToHistory({ items, members, total, assignments, itemFunders }) {
  try {
    const existing = await getSplitHistory();
    const funderIds = members.filter((m) => m.isFunder).map((m) => m.id);

    const record = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      total,
      items,
      members,
      assignments: assignments ?? {},
      itemFunders: itemFunders ?? {},
      funderIds,
    };

    const next = [record, ...existing];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    return record;
  } catch (err) {
    console.warn('Failed to save split to history:', err);
    return null;
  }
}

/**
 * Removes a single split from history by id.
 * @param {string} id
 */
export async function deleteSplitFromHistory(id) {
  try {
    const existing = await getSplitHistory();
    const next = existing.filter((split) => split.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (err) {
    console.warn('Failed to delete split from history:', err);
  }
}

/** Clears all saved history. */
export async function clearSplitHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.warn('Failed to clear split history:', err);
  }
}