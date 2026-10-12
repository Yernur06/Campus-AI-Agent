import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react';
import { themes, type Theme, type ThemeName } from '../constants/theme';
import { getNextLanguage, type Language } from '../constants/translations';
import type { StudentProfile } from '../types/student';

const ACCOUNT_STORAGE_KEY = '@campus/account';
const SESSION_STORAGE_KEY = '@campus/session';
const PROFILE_STORAGE_KEY = '@campus/profile';

export type Account = {
  login: string;
  password: string;
};

const createEmptyProfile = (login = ''): StudentProfile => ({
  fullName: login,
  photoUri: null,
  iin: '',
  studentId: '',
  birthDate: '',
  gender: 'male',
  group: '',
  course: 1,
  studyForm: 'fullTime',
  studyLanguage: 'ru',
  specialty: '',
  institute: '',
  department: '',
  academicStatus: 'studying'
});

type AppContextValue = {
  themeName: ThemeName;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  account: Account | null;
  profile: StudentProfile;
  updateProfile: (partial: Partial<StudentProfile>) => Promise<void>;
  isAuthenticated: boolean;
  isReady: boolean;
  login: () => Promise<void>;
  register: (newAccount: Account) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(() => createEmptyProfile());
  const [themeName, setThemeName] = useState<ThemeName>('dark');
  const [language, setLanguage] = useState<Language>('ru');
  const theme = themes[themeName];

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedAccount, storedSession, storedProfile] = await AsyncStorage.multiGet([
          ACCOUNT_STORAGE_KEY,
          SESSION_STORAGE_KEY,
          PROFILE_STORAGE_KEY
        ]);
        const savedAccount = storedAccount[1] ? JSON.parse(storedAccount[1]) as Account : null;
        const savedProfile = storedProfile[1]
          ? JSON.parse(storedProfile[1]) as StudentProfile
          : createEmptyProfile(savedAccount?.login ?? '');
        setAccount(savedAccount);
        setProfile(savedProfile);
        if (!storedProfile[1] && savedAccount) {
          await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(savedProfile));
        }
        setIsAuthenticated(storedSession[1] === 'true' && savedAccount !== null);
      } catch {
        setAccount(null);
        setProfile(createEmptyProfile());
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleRegister = async (newAccount: Account) => {
    const newProfile = createEmptyProfile(newAccount.login);
    await AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(newAccount));
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, 'true');
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    setAccount(newAccount);
    setProfile(newProfile);
    setIsAuthenticated(true);
  };

  const handleUpdateProfile = async (partial: Partial<StudentProfile>) => {
    const updatedProfile = { ...profile, ...partial };
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const value: AppContextValue = {
    themeName,
    theme,
    toggleTheme: () => setThemeName((current) => current === 'dark' ? 'light' : 'dark'),
    language,
    toggleLanguage: () => setLanguage(getNextLanguage),
    account,
    profile,
    updateProfile: handleUpdateProfile,
    isAuthenticated,
    isReady,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider.');
  }

  return context;
}
