import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ORPCProvider } from "@workspace/orpc/react";
import { orpc } from "@/lib/orpc";

import { useColorScheme } from "@/hooks/use-color-scheme";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        console.error("Global Mutation Error:", error);
      },
    },
  },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCProvider client={orpc}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ORPCProvider>
    </QueryClientProvider>
  );
}
