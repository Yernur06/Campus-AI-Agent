import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import HomeScreen from '../screens/HomeScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ServicesScreen from '../screens/ServicesScreen';
import { translations } from '../constants/translations';
import { useApp } from '../context/AppContext';
import type { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const tabIcons: Record<Exclude<keyof MainTabParamList, 'News'>, ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  Home: 'home-outline',
  Services: 'view-grid-outline',
  Profile: 'account-outline'
};

export function MainTabs() {
  const { theme, language } = useApp();
  const t = translations[language];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarIcon: ({ color, size }) => (
          route.name === 'News'
            ? <Ionicons name="newspaper-outline" size={size} color={color} />
            : <MaterialCommunityIcons name={tabIcons[route.name]} size={size} color={color} />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t.tabHome }} />
      <Tab.Screen name="News" component={NewsScreen} options={{ title: t.tabNews }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ title: t.tabServices }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t.tabProfile }} />
    </Tab.Navigator>
  );
}

export default MainTabs;
