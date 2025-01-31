import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState  } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '../hooks/UserContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Prompt_400Regular': require('../assets/fonts/Prompt-Regular.ttf'),
      'Prompt_500Medium': require('../assets/fonts/Prompt-Medium.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
    
    async function prepare() {
      try {
        // ซ่อน Splash Screen เมื่อพร้อม
        await SplashScreen.preventAutoHideAsync();
        setTimeout(SplashScreen.hideAsync, 25000);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();

  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(aLogin)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(course)" options={{ headerShown: false }} />
        <Stack.Screen name="(setting)" options={{ headerShown: false }}/>
      </Stack>
    </ThemeProvider>
    </UserProvider>
  );
}
