import { useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { X } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { elements } from "../theme";
import { useCreateClothesMutation } from "../services/wardrobe-service";

const emptyAddForm = {
  name: "",
  type: "",
  color: "",
  style: "",
  temperature_min: "",
  temperature_max: "",
  image_url: "",
  is_waterproof: false,
};

const imageActionButtonStyle = {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.18)",
  backgroundColor: "rgba(255,255,255,0.08)",
};

export const WardrobeCreateModalContent = ({
  isVisible,
  userId,
  onCreatingStateChange,
  saveButtonStyle,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { mutate: createClothes, isPending: isCreatingClothing } = useCreateClothesMutation();
  const [newClothing, setNewClothing] = useState(emptyAddForm);

  useEffect(() => {
    if (typeof onCreatingStateChange === "function") {
      onCreatingStateChange(isCreatingClothing);
    }
  }, [isCreatingClothing, onCreatingStateChange]);

  useEffect(() => {
    if (isVisible) {
      setNewClothing(emptyAddForm);
    }
  }, [isVisible]);

  const previewImageUri = useMemo(
    () =>
      newClothing.image_url?.trim()
        ? newClothing.image_url.trim()
        : "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
    [newClothing.image_url],
  );

  const handleAddFieldChange = (key, value) => {
    setNewClothing((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const setPickedImage = (uri) => {
    if (!uri) {
      return;
    }

    handleAddFieldChange("image_url", uri);
  };

  const openImageLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo", "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPickedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo", "L'accès à la caméra est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPickedImage(result.assets[0].uri);
    }
  };

  const handleCreateClothingPress = () => {
    if (isCreatingClothing) {
      return;
    }

    if (!newClothing.name.trim()) {
      Alert.alert("Ajouter un vêtement", "Le nom est requis.");
      return;
    }

    const minTemperatureValue = Number(newClothing.temperature_min);
    const maxTemperatureValue = Number(newClothing.temperature_max);

    const payload = {
      name: newClothing.name.trim(),
      type: newClothing.type.trim().toLowerCase() || null,
      color: newClothing.color.trim() || null,
      style: newClothing.style.trim() || null,
      min_temp: newClothing.temperature_min.trim()
        ? Number.isNaN(minTemperatureValue)
          ? null
          : minTemperatureValue
        : null,
      max_temp: newClothing.temperature_max.trim()
        ? Number.isNaN(maxTemperatureValue)
          ? null
          : maxTemperatureValue
        : null,
      is_waterproof: Boolean(newClothing.is_waterproof),
    };

    createClothes(
      { userId, clothes: payload },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["clothes"] });
          onClose();
        },
        onError: (createError) => {
          Alert.alert(
            "Ajouter un vêtement",
            createError?.message ?? "Une erreur est survenue.",
          );
        },
      },
    );
  };

  return (
    <>
      <View style={elements.wardrobeModalHeader}>
        <View style={elements.wardrobeModalHeaderTopRow}>
          <Text style={elements.wardrobeModalTitle}>Ajouter un vêtement</Text>

          <View style={elements.wardrobeModalActions}>
            <TouchableOpacity
              style={elements.wardrobeModalIconButton}
              onPress={onClose}
              activeOpacity={0.82}
            >
              <X size={19} color="#f3f5ff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={elements.wardrobeModalBody}
        contentContainerStyle={elements.wardrobeModalBodyContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          resizeMode="cover"
          source={{ uri: previewImageUri }}
          style={elements.wardrobeModalImage}
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={openImageLibrary} activeOpacity={0.85} style={imageActionButtonStyle}>
            <Text style={elements.wardrobeModalActionText}>Choisir une photo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openCamera} activeOpacity={0.85} style={imageActionButtonStyle}>
            <Text style={elements.wardrobeModalActionText}>Prendre une photo</Text>
          </TouchableOpacity>
        </View>

        <View style={elements.wardrobeModalInfoList}>
          <View style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>name</Text>
            <TextInput
              value={newClothing.name}
              onChangeText={(text) => handleAddFieldChange("name", text)}
              style={elements.wardrobeModalInfoValue}
              placeholder="Nom du vêtement"
              placeholderTextColor="rgba(243,245,255,0.5)"
            />
          </View>

          <View style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>type</Text>
            <TextInput
              value={newClothing.type}
              onChangeText={(text) => handleAddFieldChange("type", text)}
              style={elements.wardrobeModalInfoValue}
              placeholder="Pull, pantalon, veste..."
              placeholderTextColor="rgba(243,245,255,0.5)"
            />
          </View>

          <View style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>color</Text>
            <TextInput
              value={newClothing.color}
              onChangeText={(text) => handleAddFieldChange("color", text)}
              style={elements.wardrobeModalInfoValue}
              placeholder="Couleur"
              placeholderTextColor="rgba(243,245,255,0.5)"
            />
          </View>

          <View style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>style</Text>
            <TextInput
              value={newClothing.style}
              onChangeText={(text) => handleAddFieldChange("style", text)}
              style={elements.wardrobeModalInfoValue}
              placeholder="Casual, chic..."
              placeholderTextColor="rgba(243,245,255,0.5)"
            />
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[elements.wardrobeModalInfoRow, { flex: 1 }]}>
              <Text style={elements.wardrobeModalInfoKey}>temperature_min</Text>
              <TextInput
                value={newClothing.temperature_min}
                onChangeText={(text) => handleAddFieldChange("temperature_min", text)}
                style={elements.wardrobeModalInfoValue}
                placeholder="Min"
                placeholderTextColor="rgba(243,245,255,0.5)"
                keyboardType="numeric"
              />
            </View>

            <View style={[elements.wardrobeModalInfoRow, { flex: 1 }]}>
              <Text style={elements.wardrobeModalInfoKey}>temperature_max</Text>
              <TextInput
                value={newClothing.temperature_max}
                onChangeText={(text) => handleAddFieldChange("temperature_max", text)}
                style={elements.wardrobeModalInfoValue}
                placeholder="Max"
                placeholderTextColor="rgba(243,245,255,0.5)"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>image_url</Text>
            <TextInput
              value={newClothing.image_url}
              onChangeText={(text) => handleAddFieldChange("image_url", text)}
              style={elements.wardrobeModalInfoValue}
              placeholder="Lien de l'image"
              placeholderTextColor="rgba(243,245,255,0.5)"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>is_waterproof</Text>
            <TouchableOpacity
              onPress={() => handleAddFieldChange("is_waterproof", !newClothing.is_waterproof)}
              activeOpacity={0.85}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 48,
                  height: 30,
                  borderRadius: 15,
                  padding: 3,
                  backgroundColor: newClothing.is_waterproof
                    ? "rgba(10,132,255,0.35)"
                    : "rgba(255,255,255,0.14)",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                    transform: [{ translateX: newClothing.is_waterproof ? 18 : 0 }],
                  }}
                />
              </View>
              <Text style={elements.wardrobeModalInfoValue}>
                {newClothing.is_waterproof ? "Oui" : "Non"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            elements.wardrobeModalBottomDeleteButton,
            elements.wardrobeModalActionButton,
            saveButtonStyle,
          ]}
          onPress={handleCreateClothingPress}
          activeOpacity={0.86}
          disabled={isCreatingClothing}
        >
          <Text style={elements.wardrobeModalActionText}>
            {isCreatingClothing ? "Création..." : "Créer"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
