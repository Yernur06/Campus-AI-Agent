export type ThemeName = 'light' | 'dark';

export type Theme = {
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    border: string;
    primary: string;
    primaryPressed: string;
    text: string;
    mutedText: string;
    placeholder: string;
    error: string;
    disabled: string;
    selected: string;
    newBadge: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

export const themes: Record<ThemeName, Theme> = {
  dark: {
    colors: {
      background: '#050505',
      surface: '#151515',
      surfaceMuted: '#0D0D0D',
      border: '#343434',
      primary: '#F1EFE8',
      primaryPressed: '#C9C6BE',
      text: '#FFFDF7',
      mutedText: '#B8B6B0',
      placeholder: '#85837E',
      error: '#FFB4AC',
      disabled: '#252525',
      selected: '#292824',
      newBadge: '#D8D4CA'
    },
    spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 }
  },
  light: {
    colors: {
      background: '#F3F0E8',
      surface: '#FFFDF7',
      surfaceMuted: '#EAE6DD',
      border: '#D1CCC1',
      primary: '#171717',
      primaryPressed: '#3A3A3A',
      text: '#171717',
      mutedText: '#65635E',
      placeholder: '#898780',
      error: '#A5241A',
      disabled: '#D9D5CC',
      selected: '#E2DDD2',
      newBadge: '#4E4B45'
    },
    spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 }
  }
};
