import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import TopActions from '../components/TopActions';
import { translations } from '../constants/translations';
import { useApp } from '../context/AppContext';
import type { Account } from '../context/AppContext';
import type { RootStackParamList } from '../types/navigation';

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const MIN_PASSWORD_LENGTH = 6;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme, themeName, language, register } = useApp();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const t = translations[language];

  const handleSubmit = async () => {
    if (!loginValue.trim() || !password || !confirmation) {
      Alert.alert(t.errorTitle, t.allFields);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(t.errorTitle, t.minPassword(MIN_PASSWORD_LENGTH));
      return;
    }

    if (password !== confirmation) {
      Alert.alert(t.errorTitle, t.passwordsMismatch);
      return;
    }

    const newAccount: Account = { login: loginValue.trim(), password };
    await register(newAccount);
    navigation.replace('Main');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { padding: theme.spacing.lg }]}
          keyboardShouldPersistTaps="handled"
        >
          <TopActions showLogout={false} />
          <View style={[styles.card, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>CAMPUS PORTAL</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>{t.registerTitle}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>{t.registerSubtitle}</Text>

            <Text style={[styles.label, { color: theme.colors.text }]}>{t.login}</Text>
            <TextInput
              value={loginValue}
              onChangeText={setLoginValue}
              placeholder={t.newLoginPlaceholder}
              placeholderTextColor={theme.colors.placeholder}
              autoCapitalize="none"
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }]}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>{t.password}</Text>
            <View style={[styles.passwordRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t.minPassword(MIN_PASSWORD_LENGTH)}
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[styles.passwordInput, { color: theme.colors.text }]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? t.hide : t.show}
                onPress={() => setShowPassword((visible) => !visible)}
                style={styles.visibilityButton}
              >
                <Text style={[styles.visibilityText, { color: theme.colors.primary }]}>{showPassword ? t.hide : t.show}</Text>
              </Pressable>
            </View>

            <Text style={[styles.label, { color: theme.colors.text }]}>{t.repeatPassword}</Text>
            <TextInput
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder={t.repeatPasswordPlaceholder}
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }]}
            />

            <Pressable
              onPress={() => { void handleSubmit(); }}
              style={({ pressed }) => [styles.submitButton, { backgroundColor: pressed ? theme.colors.primaryPressed : theme.colors.primary }]}
            >
              <Text style={styles.submitText}>{t.register}</Text>
            </Pressable>
            <Pressable onPress={() => navigation.goBack()} style={styles.secondaryButton}>
              <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>{t.backToLogin}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center' },
  card: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.6, marginBottom: 14 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 14 },
  input: { height: 54, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
  passwordRow: { height: 54, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 16 },
  visibilityButton: { paddingHorizontal: 14, paddingVertical: 10 },
  visibilityText: { fontSize: 13, fontWeight: '700' },
  submitButton: { height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  submitText: { color: '#FFFDF7', fontSize: 16, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', textAlign: 'center' }
});

