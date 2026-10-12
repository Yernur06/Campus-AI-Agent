import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { getNextLanguage, translations } from '../constants/translations';
import type { RootStackParamList } from '../types/navigation';

export type TopActionsProps = {
  showLogout?: boolean;
};

export default function TopActions({ showLogout = true }: TopActionsProps) {
  const { theme, themeName, language, toggleTheme, toggleLanguage, logout } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const t = translations[language];

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.switchTheme(themeName)}
        onPress={toggleTheme}
        style={({ pressed }) => [styles.iconButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: pressed ? 0.75 : 1 }]}
      >
        <Text style={[styles.controlIcon, { color: theme.colors.text }]}>{themeName === 'dark' ? '☀' : '☾'}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.switchLanguage(getNextLanguage(language))}
        onPress={toggleLanguage}
        style={({ pressed }) => [styles.iconButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: pressed ? 0.75 : 1 }]}
      >
        <MaterialCommunityIcons name="translate" size={22} color={theme.colors.text} />
      </Pressable>
      {showLogout ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.logout}
          onPress={() => { void handleLogout(); }}
          style={({ pressed }) => [styles.iconButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, opacity: pressed ? 0.75 : 1 }]}
        >
          <MaterialCommunityIcons name="door-open" size={23} color={theme.colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18
  },
  iconButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlIcon: {
    fontSize: 23,
    lineHeight: 26,
    fontWeight: '700'
  }
});

