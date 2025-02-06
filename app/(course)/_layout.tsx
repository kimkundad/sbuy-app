import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="courseDetail" options={{ headerShown: false }} />
      <Stack.Screen name="video" options={{ headerShown: false }}/>
      <Stack.Screen name="chat" options={{ headerShown: false }}/>
      <Stack.Screen name="chatList" options={{ headerShown: false }}/>
      <Stack.Screen name="packDetail" options={{ headerShown: false }}/>
    </Stack>
  );
}