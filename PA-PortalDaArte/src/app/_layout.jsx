// app/_layout.jsx
import { Slot } from 'expo-router';
import { ThemeProvider } from '../components/context/ThemeContext';
import { ProfileProvider } from '../components/context/ProfileContext';

export default function RootLayout() {
  return (
    // O ThemeProvider abraça o "Slot" (que é onde o Expo injeta suas telas)
    <ThemeProvider>
      <ProfileProvider>
        <Slot />
      </ProfileProvider>
    </ThemeProvider>
  );
}