import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { translations } from '../constants/translations';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../types/navigation';

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  const serviceId = route.params?.serviceId;
  const title = route.params?.title;
  const { theme, themeName, language } = useApp();
  const t = translations[language];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.content, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {serviceId ? (
          <>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.serviceId, { color: theme.colors.mutedText }]}>ID: {serviceId}</Text>
          </>
        ) : (
          <Text style={[styles.title, { color: theme.colors.text }]}>{t.routeNotFound}</Text>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, {
            backgroundColor: pressed ? theme.colors.primaryPressed : theme.colors.primary
          }]}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.background }]}>{t.back}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 620, alignSelf: 'center', padding: 24, borderWidth: 1, borderRadius: 14 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
  serviceId: { fontSize: 16, marginBottom: 28 },
  backButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingHorizontal: 18 },
  backButtonText: { fontSize: 16, fontWeight: '700' }
});
