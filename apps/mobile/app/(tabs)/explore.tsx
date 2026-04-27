import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlanets, useCreatePlanet, useUpdatePlanet, useDeletePlanet } from "@workspace/orpc/react";

const planetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  distance: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Must be a number",
  }),
  diameter: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Must be a number",
  }),
});

export default function ExploreScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: planets = [], isLoading } = usePlanets();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      distance: "0",
      diameter: "0",
    },
    validators: {
      onChange: planetSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        description: value.description || undefined,
        distanceFromSun: parseFloat(value.distance) || 0,
        diameter: parseFloat(value.diameter) || 0,
        hasRings: false,
      };

      try {
        if (editingId) {
          await updateMutation.mutateAsync({ id: editingId, ...payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        closeModal();
      } catch (err) {
        // Error handled in mutation callbacks
      }
    },
  });

  const resetForm = () => {
    form.reset();
    setEditingId(null);
  };

  const createMutation = useCreatePlanet({
    onSuccess: () => {
      Alert.alert("Success", "Planet added successfully");
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to add planet");
    },
  });

  const updateMutation = useUpdatePlanet({
    onSuccess: () => {
      Alert.alert("Success", "Planet updated successfully");
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to update planet");
    },
  });

  const deleteMutation = useDeletePlanet({
    onSuccess: () => {
      Alert.alert("Success", "Planet deleted successfully");
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to delete planet");
    },
  });

  const handleEdit = (planet: any) => {
    setEditingId(planet.id);
    form.setFieldValue("name", planet.name);
    form.setFieldValue("description", planet.description || "");
    form.setFieldValue("distance", planet.distanceFromSun.toString());
    form.setFieldValue("diameter", planet.diameter.toString());
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutateAsync({id})
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={planets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.planetCard}>
            <View style={styles.planetInfo}>
              <Text style={styles.planetName}>{item.name}</Text>
              <Text style={styles.planetDesc}>{item.description}</Text>
              <Text style={styles.planetDetails}>
                Distance: {item.distanceFromSun} AU • Diameter: {item.diameter} km
              </Text>
            </View>
            <View style={styles.actions}>
              <Button
                variant="outline"
                onPress={() => handleEdit(item)}
                style={styles.actionBtn}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onPress={() => handleDelete(item.id)}
                style={styles.actionBtn}
              >
                Delete
              </Button>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No planets found. Add one!</Text>
        }
      />

      <Button
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        Add Planet
      </Button>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Planet" : "Add New Planet"}
            </Text>

            <form.Field name="name">
              {(field: any) => (
                <Input
                  label="Name"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Earth"
                  error={field.state.meta.errors?.[0]?.toString()}
                />
              )}
            </form.Field>

            <form.Field name="description">
              {(field: any) => (
                <Input
                  label="Description"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="The blue planet"
                />
              )}
            </form.Field>

            <form.Field name="distance">
              {(field: any) => (
                <Input
                  label="Distance from Sun (AU)"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  keyboardType="numeric"
                  error={field.state.meta.errors?.[0]?.toString()}
                />
              )}
            </form.Field>

            <form.Field name="diameter">
              {(field: any) => (
                <Input
                  label="Diameter (km)"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  keyboardType="numeric"
                  error={field.state.meta.errors?.[0]?.toString()}
                />
              )}
            </form.Field>

            <View style={styles.modalActions}>
              <Button
                variant="outline"
                onPress={closeModal}
                style={styles.modalBtn}
              >
                Cancel
              </Button>
              <Button
                onPress={form.handleSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
                style={styles.modalBtn}
              >
                {editingId ? "Update" : "Create"}
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  planetCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planetInfo: {
    marginBottom: 16,
  },
  planetName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planetDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  planetDetails: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 36,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContent: {
    padding: 24,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  modalBtn: {
    flex: 1,
  },
});
