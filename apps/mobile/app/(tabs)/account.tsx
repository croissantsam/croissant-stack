import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountScreen() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [updating, setUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
      return;
    }

    if (session) {
      setName(session.user.name);
      setEmail(session.user.email);
    }
  }, [session, isPending, router]);

  const handleUpdateProfile = async () => {
    if (!name) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name,
      });

      if (error) {
        Alert.alert("Error", error.message || "Failed to update profile");
      } else {
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Account Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <View style={styles.form}>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <Input
            label="Email"
            value={email}
            editable={false}
            style={styles.disabledInput}
          />
          <Button 
            onPress={handleUpdateProfile} 
            loading={updating}
            style={styles.button}
          >
            Update Profile
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.infoText}>
          Password management and other security settings are currently available on the web platform.
        </Text>
      </View>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  form: {
    gap: 16,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  button: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
});
