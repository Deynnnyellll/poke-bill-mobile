import { useAudioPlayer } from 'expo-audio';

export function useSoundEffect(source) {
  const player = useAudioPlayer(source);

  return () => {
    try {
      Promise.resolve(player.seekTo(0))
        .then(() => player.play())
        .catch(() => {});
    } catch {
      // Player may not be loaded yet — skip the sound rather than block the caller.
    }
  };
}
