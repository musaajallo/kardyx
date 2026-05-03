import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 px-8 pt-16">
        <Text className="font-mono text-xs uppercase tracking-widest text-clay-deep">Phase 1 · Foundation</Text>
        <Text className="mt-4 font-display text-6xl font-semibold text-ink">Kardyx</Text>
        <Text className="mt-6 font-body text-lg italic leading-7 text-ink-soft">
          The cards in your hand are the interface. The game lives in the engine.
        </Text>
      </View>
    </SafeAreaView>
  );
}
