// utils/splitDraft.js
// Persists in-progress splits (not yet finished) to device storage so an
// interrupted session can be resumed. Separate key from split-history.jsx,
// which only stores completed/saved splits.

import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY = 'bill-splitter:draft';

/**
 * Saves the current in-progress split. Call this right before navigating to
 * the next step, not on every keystroke.
 * @param {{ members: object[], items: object[], total: number, assignments: object, itemFunders: object, step: number, route: string }} draft
 */
export async function saveDraft({ members, items, total, assignments, itemFunders, step, route }) {
  try {
    const record = {
      members,
      items,
      total,
      assignments,
      itemFunders,
      step,
      route,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(record));
    return record;
  } catch (err) {
    console.warn('Failed to save split draft:', err);
    return null;
  }
}

/**
 * Returns the saved in-progress split, or null if none exists.
 * @returns {Promise<{members: object[], items: object[], total: number, assignments: object, itemFunders: object, step: number, route: string, updatedAt: string} | null>}
 */
export async function getDraft() {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read split draft:', err);
    return null;
  }
}

/** Clears the saved in-progress split (call once it's finished or discarded). */
export async function clearDraft() {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.warn('Failed to clear split draft:', err);
  }
}
