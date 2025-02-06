import { Stack } from 'expo-router';
import { UserProvider } from '../../hooks/UserContext';

export default function Layout() {
  return (
    <UserProvider>
    <Stack>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="helpcen"  options={{ headerShown: false }}/>
      <Stack.Screen name="policy" options={{ headerShown: false }}/>
      <Stack.Screen name="about"  options={{ headerShown: false }}/>
    </Stack>
    </UserProvider>
  );
}