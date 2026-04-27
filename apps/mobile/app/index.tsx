import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { usePlanets, useHello } from "@workspace/orpc/react";

export default function LandingScreen() {
  const router = useRouter();
  const { data: helloData, isLoading: isHelloLoading } = useHello("Croissant Stack Mobile");
  const { data: planets = [], isLoading: isPlanetsLoading } = usePlanets();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Project ready!</Text>
        <Text style={styles.subtitle}>
          oRPC integration: <Text style={styles.bold}>
            {isHelloLoading ? "Loading..." : helloData?.message}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planets from Database:</Text>
        {isPlanetsLoading ? (
          <Text style={styles.loading}>Loading planets...</Text>
        ) : planets.length === 0 ? (
          <Text style={styles.empty}>
            No planets found in the database. Run `db:push` and seed data if needed.
          </Text>
        ) : (
          planets.map((planet: any) => (
            <View key={planet.id} style={styles.planetCard}>
              <Text style={styles.planetName}>{planet.name}</Text>
              <Text style={styles.planetDesc}>{planet.description}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.footer}>
        <Button onPress={() => router.push("/login")} style={styles.button}>
          Go to Login
        </Button>
        <Button 
          onPress={() => router.push("/(tabs)")} 
          variant="outline" 
          style={styles.button}
        >
          Go to Dashboard
        </Button>
        <Text style={styles.footerText}>
          You may now add components and start building.
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
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  planetCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  planetName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planetDesc: {
    fontSize: 14,
    color: "#666",
  },
  loading: {
    fontStyle: "italic",
    color: "#999",
  },
  empty: {
    fontStyle: "italic",
    color: "#999",
  },
  footer: {
    gap: 12,
  },
  button: {
    width: "100%",
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
});
