import { StatusBar } from 'expo-status-bar';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import TopActions from '../components/TopActions';
import { translations } from '../constants/translations';
import { useApp } from '../context/AppContext';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';

type ServicesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Services'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ServiceStatus = 'new' | 'available' | 'unavailable';

type Service = {
  id: number;
  serviceId: string;
  icon: string;
  status: ServiceStatus;
};

const services: Service[] = [
  { id: 0, serviceId: 'library', icon: '\u25a6', status: 'available' },
  { id: 1, serviceId: 'cafeteria', icon: '\u2726', status: 'new' },
  { id: 2, serviceId: 'transport', icon: '\u2192', status: 'available' },
  { id: 3, serviceId: 'it-support', icon: '\u2318', status: 'available' },
  { id: 4, serviceId: 'medical', icon: '+', status: 'unavailable' },
  { id: 5, serviceId: 'sports', icon: '\u25cb', status: 'new' },
  { id: 6, serviceId: 'dean', icon: '\u25b3', status: 'available' },
  { id: 7, serviceId: 'payments', icon: '\u20b8', status: 'available' }
];

export default function ServicesScreen({ navigation }: ServicesScreenProps) {
  const { theme, themeName, language } = useApp();
  const { width } = useWindowDimensions();
  const [selectedServices, setSelectedServices] = useState<number[]>([0, 3]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const t = translations[language];
  const columns = width >= 600 ? 3 : 2;
  const visibleServices = showSelectedOnly
    ? services.filter((service) => selectedServices.includes(service.id))
    : services;

  const toggleService = (service: Service) => {
    if (service.status === 'unavailable') {
      return;
    }

    setSelectedServices((current) => current.includes(service.id)
      ? current.filter((id) => id !== service.id)
      : [...current, service.id]);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          padding: theme.spacing.lg,
          paddingTop: theme.spacing.xl * 2
        }
      ]}
    >
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <TopActions showLogout={false} />
      <Text style={[styles.eyebrow, { color: theme.colors.primary, marginBottom: theme.spacing.sm }]}>CAMPUS PORTAL</Text>
      <Text style={[styles.title, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>{t.servicesTitle}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.mutedText, marginBottom: theme.spacing.lg }]}>{t.campusSubtitle}</Text>

      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: showSelectedOnly }}
          onPress={() => setShowSelectedOnly((visible) => !visible)}
          style={({ pressed }) => [styles.toolbarButton, {
            backgroundColor: showSelectedOnly ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
            opacity: pressed ? 0.75 : 1
          }]}
        >
          <Text style={[styles.toolbarButtonText, { color: showSelectedOnly ? theme.colors.background : theme.colors.text }]}>{t.selectedOnly}</Text>
        </Pressable>
      </View>

      <View style={[styles.servicesList, { gap: theme.spacing.sm }]}>
        {visibleServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const isUnavailable = service.status === 'unavailable';
          const [title, subtitle] = t.services[service.id];
          const statusLabel = isUnavailable
            ? t.unavailable
            : isSelected
              ? t.selected
              : service.status === 'new'
                ? t.new
                : null;

          return (
            <Pressable
              key={service.id}
              accessibilityRole="button"
              accessibilityLabel={title}
              accessibilityHint={t.longPressToSelect}
              accessibilityState={{ selected: isSelected, disabled: isUnavailable }}
              disabled={isUnavailable}
              onPress={() => navigation.navigate('Details', { serviceId: service.serviceId, title })}
              onLongPress={() => toggleService(service)}
              style={({ pressed }) => [styles.serviceCard, {
                width: columns === 2 ? '48%' : '31%',
                backgroundColor: isUnavailable
                  ? theme.colors.disabled
                  : isSelected
                    ? theme.colors.selected
                    : theme.colors.surface,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                opacity: isUnavailable ? 0.6 : pressed ? 0.78 : 1
              }, pressed && !isUnavailable && styles.cardPressed]}
            >
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <View style={styles.serviceCopy}>
                <Text style={[styles.serviceTitle, { color: theme.colors.text }]}>{title}</Text>
                <Text style={[styles.serviceSubtitle, { color: theme.colors.mutedText }]}>{subtitle}</Text>
                {statusLabel ? (
                  <Text style={[styles.statusBadge, {
                    color: isUnavailable
                      ? theme.colors.mutedText
                      : isSelected
                        ? theme.colors.primary
                        : theme.colors.newBadge
                  }]}>
                    {statusLabel}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.chevron, { color: theme.colors.primary }]}>{isUnavailable ? '\u2014' : '\u203a'}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.6, marginBottom: 14 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 24, marginBottom: 30 },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  toolbarButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  toolbarButtonText: { fontSize: 13, fontWeight: '700' },
  servicesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, width: '100%', maxWidth: 620, alignSelf: 'center' },
  serviceCard: {
    minHeight: 166,
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4
  },
  serviceIcon: { fontSize: 30, marginBottom: 10 },
  serviceCopy: { flex: 1 },
  serviceTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  serviceSubtitle: { fontSize: 14, lineHeight: 20 },
  statusBadge: { fontSize: 12, fontWeight: '800', marginTop: 10 },
  cardPressed: { transform: [{ scale: 0.98 }] },
  chevron: { position: 'absolute', top: 10, right: 14, fontSize: 32, fontWeight: '300' }
});
