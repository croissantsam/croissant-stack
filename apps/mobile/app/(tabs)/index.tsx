import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";
import { Button } from "@/components/ui/button";

export default function DashboardScreen() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [secretData, setSecretData] = useState<string>("");
  const [loadingSecret, setLoadingSecret] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
      return;
    }

    if (session) {
      const fetchSecret = async () => {
        setLoadingSecret(true);
        try {
          const res = await orpc.getSecretData();
          setSecretData(res.secret);
        } catch (err: any) {
          setSecretData("Error: " + (err.message || "Unknown error"));
        } finally {
          setLoadingSecret(false);
        }
      };

      fetchSecret();
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/");
  };

  if (isPending) {
    return (
      <View style={styles.center}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {session?.user?.name}!</Text>
      <Text style={styles.description}>
        This is a protected page. Only authenticated users can see this.
      </Text>

      <View style={styles.secureBox}>
        <Text style={styles.secureTitle}>Secure oRPC Data:</Text>
        <Text style={styles.secureContent}>{secretData}</Text>
      </View>

      <Button variant="destructive" onPress={handleSignOut} style={styles.signOutBtn}>
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  secureBox: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 24,
  },
  secureTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  secureContent: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
  },
  signOutBtn: {
    marginTop: 12,
  },
});
