import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useQueryClient } from "@tanstack/react-query";
import { elements } from "../theme";
import { useUpdateClothesMutation } from "../services/wardrobe-service";
import { uploadImageToSupabaseStorage } from "../services/storage-service";

export const WardrobeEditModalContent = ({
  selectedClothing,
  userId,
  editOpacity,
  editTranslateY,
  getImageUri,
  onSavingStateChange,
  onUpdatedClothing,
  onCloseAfterSave,
  saveButtonStyle,
}) => {
  const queryClient = useQueryClient();
  const { mutate: updateClothes, isPending: isSavingEdit } = useUpdateClothesMutation();
  const [editedClothing, setEditedClothing] = useState(selectedClothing ?? {});
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (typeof onSavingStateChange === "function") {
      onSavingStateChange(isSavingEdit);
    }
  }, [isSavingEdit, onSavingStateChange]);

  useEffect(() => {
    setEditedClothing(selectedClothing ?? {});
  }, [selectedClothing]);

  const editableInfoEntries = useMemo(
    () =>
      Object.entries(editedClothing ?? {}).filter(
        ([key]) =>
          ![
            "id",
            "_id",
            "image_url",
            "imageUrl",
            "photo_url",
            "photoUrl",
            "image",
            "url",
            "user_id",
          ].includes(key),
      ),
    [editedClothing],
  );

  const currentEditPreviewUri =
    editedClothing.image_url ?? editedClothing.imageUrl ?? getImageUri(selectedClothing);

  const handleEditFieldChange = (key, newValue) => {
    setEditedClothing((current) => ({
      ...current,
      [key]: newValue,
    }));
  };

  const setEditedPickedImage = (uri) => {
    if (!uri) {
      return;
    }

    setEditedClothing((current) => ({
      ...current,
      image_url: uri,
    }));
  };

  const handleUploadPickedImage = async (localUri) => {
    if (!localUri) {
      return;
    }

    try {
      setIsUploadingImage(true);
      const publicUrl = await uploadImageToSupabaseStorage({
        userId,
        localUri,
      });
      setEditedPickedImage(publicUrl);
    } catch (uploadError) {
      Alert.alert("Photo", uploadError?.message ?? "Erreur pendant l'upload de l'image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const openEditImageLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo", "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await handleUploadPickedImage(result.assets[0].uri);
    }
  };

  const openEditCamera = async () => {
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
      await handleUploadPickedImage(result.assets[0].uri);
    }
  };

  const handleSaveEditPress = () => {
    if (isSavingEdit || isUploadingImage) {
      return;
    }

    const selectedId = selectedClothing?.id ?? selectedClothing?._id;
    if (!selectedId) {
      Alert.alert("Modifier", "Impossible de trouver l'identifiant du vêtement.");
      return;
    }

    const editedMinTempRaw = editedClothing.min_temp ?? editedClothing.temperature_min ?? "";
    const editedMaxTempRaw = editedClothing.max_temp ?? editedClothing.temperature_max ?? "";
    const minTemperatureValue = Number(editedMinTempRaw);
    const maxTemperatureValue = Number(editedMaxTempRaw);

    const payload = {
      name: editedClothing.name?.trim() || null,
      type: editedClothing.type?.trim() || null,
      color: editedClothing.color?.trim() || null,
      style: editedClothing.style?.trim() || null,
      min_temp: String(editedMinTempRaw).trim()
        ? Number.isNaN(minTemperatureValue)
          ? null
          : minTemperatureValue
        : null,
      max_temp: String(editedMaxTempRaw).trim()
        ? Number.isNaN(maxTemperatureValue)
          ? null
          : maxTemperatureValue
        : null,
      image_url: editedClothing.image_url?.trim() || null,
      is_waterproof:
        editedClothing.is_waterproof == null
          ? null
          : Boolean(editedClothing.is_waterproof),
    };

    updateClothes(
      { clothingId: selectedId, userId, clothes: payload },
      {
        onSuccess: async (updatedClothing) => {
          await queryClient.invalidateQueries({ queryKey: ["clothes"] });
          if (typeof onUpdatedClothing === "function") {
            onUpdatedClothing(updatedClothing);
          }
          if (typeof onCloseAfterSave === "function") {
            onCloseAfterSave();
          }
          Alert.alert("Modifier", "Vêtement mis à jour.");
        },
        onError: (mutationError) => {
          Alert.alert("Modifier", mutationError.message ?? "Une erreur est survenue.");
        },
      },
    );
  };

  return (
    <Animated.View
      style={{
        opacity: editOpacity,
        transform: [{ translateY: editTranslateY }],
      }}
    >
      <Image
        resizeMode="cover"
        source={{ uri: currentEditPreviewUri }}
        style={elements.wardrobeModalImage}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={openEditImageLibrary}
          activeOpacity={0.85}
          disabled={isSavingEdit || isUploadingImage}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.18)",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text style={elements.wardrobeModalActionText}>Choisir une photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openEditCamera}
          activeOpacity={0.85}
          disabled={isSavingEdit || isUploadingImage}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.18)",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text style={elements.wardrobeModalActionText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>

      <View style={elements.wardrobeModalInfoList}>
        {editableInfoEntries.map(([key, value]) => (
          <View key={key} style={elements.wardrobeModalInfoRow}>
            <Text style={elements.wardrobeModalInfoKey}>{key}</Text>
            <TextInput
              value={value == null ? "" : String(value)}
              onChangeText={(text) => handleEditFieldChange(key, text)}
              style={elements.wardrobeModalInfoValue}
              placeholder="-"
              placeholderTextColor="rgba(243,245,255,0.5)"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          elements.wardrobeModalBottomDeleteButton,
          elements.wardrobeModalActionButton,
          saveButtonStyle,
        ]}
        onPress={handleSaveEditPress}
        activeOpacity={0.86}
        disabled={isSavingEdit || isUploadingImage}
      >
        <Text style={elements.wardrobeModalActionText}>
          {isUploadingImage ? "Upload image..." : isSavingEdit ? "Enregistrement..." : "Enregistrer"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
