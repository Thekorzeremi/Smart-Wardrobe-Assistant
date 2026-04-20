import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { elements } from "../theme";
import { useRefreshOnFocus } from "../hooks/use-refresh-on-focus";
import { useGetClothesQuery } from "../services/wardrobe-service";
import { useEffect, useRef, useState } from "react";
import { Pencil, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "../services/supabase";
import { useQueryClient } from "@tanstack/react-query";

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
export const Wardrobe = () => {
  useRefreshOnFocus();
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [editedClothing, setEditedClothing] = useState({});
  const [newClothing, setNewClothing] = useState(emptyAddForm);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isCreatingClothing, setIsCreatingClothing] = useState(false);
  const editTranslateY = useRef(new Animated.Value(42)).current;
  const editOpacity = useRef(new Animated.Value(0)).current;
  const addTranslateY = useRef(new Animated.Value(48)).current;
  const addOpacity = useRef(new Animated.Value(0)).current;
  const isEditAnimatingRef = useRef(false);
  const isAddAnimatingRef = useRef(false);
  const saveTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (route.params?.openAddModal) {
      openAddModal();
      navigation.setParams({ openAddModal: false });
    }
  }, [navigation, route.params?.openAddModal]);

  const { data, isLoading, error, refetch } = useGetClothesQuery();

  const openClothingModal = (item) => {
    setSelectedClothing(item);
    setIsEditModalOpen(false);
    setIsModalOpen(true);
  };

  const closeClothingModal = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsSavingEdit(false);
    setSelectedClothing(null);
    setEditedClothing({});
  };

  const openAddModal = () => {
    if (isAddAnimatingRef.current || isCreatingClothing) {
      return;
    }

    setNewClothing(emptyAddForm);
    setIsAddModalOpen(true);
    addTranslateY.setValue(48);
    addOpacity.setValue(0);
    isAddAnimatingRef.current = true;

    Animated.parallel([
      Animated.timing(addTranslateY, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(addOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isAddAnimatingRef.current = false;
    });
  };

  const animateAddClose = (onFinished) => {
    if (isAddAnimatingRef.current) {
      return;
    }

    isAddAnimatingRef.current = true;
    Animated.parallel([
      Animated.timing(addTranslateY, {
        toValue: 48,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(addOpacity, {
        toValue: 0,
        duration: 170,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAddModalOpen(false);
      isAddAnimatingRef.current = false;
      if (typeof onFinished === "function") {
        onFinished();
      }
    });
  };

  const closeAddModal = () => {
    if (isCreatingClothing) {
      return;
    }

    animateAddClose(() => setNewClothing(emptyAddForm));
  };

  const setPickedImage = (uri) => {
    if (!uri) {
      return;
    }

    setNewClothing((current) => ({
      ...current,
      image_url: uri,
    }));
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

  const getImageUri = (item) => {
    if (!item) {
      return "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif";
    }

    return (
      item.image_url ??
      item.imageUrl ??
      item.photo_url ??
      item.photoUrl ??
      item.image ??
      item.url ??
      "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif"
    );
  };

  const modalInfoEntries = Object.entries(selectedClothing ?? {}).filter(
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
  );

  const editableInfoEntries = Object.entries(editedClothing ?? {}).filter(
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
  );

  const handleEditPress = () => {
    if (isEditAnimatingRef.current || isSavingEdit) {
      return;
    }

    setEditedClothing(selectedClothing ?? {});
    setIsEditModalOpen(true);
    editTranslateY.setValue(68);
    editOpacity.setValue(0);
    isEditAnimatingRef.current = true;

    Animated.parallel([
      Animated.timing(editTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(editOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isEditAnimatingRef.current = false;
    });
  };

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

  const openEditImageLibrary = async () => {
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
      setEditedPickedImage(result.assets[0].uri);
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
      setEditedPickedImage(result.assets[0].uri);
    }
  };

  const animateEditClose = (onFinished) => {
    if (isEditAnimatingRef.current) {
      return;
    }

    isEditAnimatingRef.current = true;
    Animated.parallel([
      Animated.timing(editTranslateY, {
        toValue: 68,
        duration: 210,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(editOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsEditModalOpen(false);
      isEditAnimatingRef.current = false;
      if (typeof onFinished === "function") {
        onFinished();
      }
    });
  };

  const handleSaveEditPress = () => {
    if (isSavingEdit || isEditAnimatingRef.current) {
      return;
    }

    setIsSavingEdit(true);
    saveTimerRef.current = setTimeout(() => {
      setSelectedClothing((current) => ({
        ...(current ?? {}),
        ...(editedClothing ?? {}),
      }));

      animateEditClose(() => {
        setIsSavingEdit(false);
        Alert.alert("Modifier", "Modifications enregistrées localement.");
      });
    }, 1500);
  };

  const closeEditModal = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    setIsSavingEdit(false);
    animateEditClose();
  };

  const handleModalDismiss = () => {
    if (isEditModalOpen) {
      closeEditModal();
      return;
    }

    closeClothingModal();
  };

  const saveButtonStyle = {
    backgroundColor: "rgba(10,132,255,0.26)",
    borderColor: "rgba(255,255,255,0.22)",
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Supprimer ce vêtement ?",
      "Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert("Supprimer", "Fonctionnalité de suppression à venir.");
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleClosePress = () => {
    closeClothingModal();
  };

  const currentEditPreviewUri =
    editedClothing.image_url ?? editedClothing.imageUrl ?? getImageUri(selectedClothing);

  const handleAddFieldChange = (key, value) => {
    setNewClothing((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleCreateClothingPress = async () => {
    if (isCreatingClothing || isAddAnimatingRef.current) {
      return;
    }

    if (!newClothing.name.trim()) {
      Alert.alert("Ajouter un vêtement", "Le nom est requis.");
      return;
    }

    setIsCreatingClothing(true);

    const minTemperatureValue = Number(newClothing.temperature_min);
    const maxTemperatureValue = Number(newClothing.temperature_max);

    const payload = {
      name: newClothing.name.trim(),
      type: newClothing.type.trim() || null,
      color: newClothing.color.trim() || null,
      style: newClothing.style.trim() || null,
      temperature_min: newClothing.temperature_min.trim()
        ? Number.isNaN(minTemperatureValue)
          ? null
          : minTemperatureValue
        : null,
      temperature_max: newClothing.temperature_max.trim()
        ? Number.isNaN(maxTemperatureValue)
          ? null
          : maxTemperatureValue
        : null,
      image_url: newClothing.image_url.trim() || null,
      is_waterproof: Boolean(newClothing.is_waterproof),
    };

    const { error: insertError } = await supabase.from("clothes").insert([payload]);

    if (insertError) {
      setIsCreatingClothing(false);
      Alert.alert("Ajouter un vêtement", insertError.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["clothes"] });
    setIsCreatingClothing(false);
    animateAddClose(() => {
      setNewClothing(emptyAddForm);
    });
  };

  return (
    <SafeAreaView style={elements.wardrobeContainer} edges={["top", "bottom"]}>
      <StatusBar
        style={isModalOpen || isEditModalOpen || isAddModalOpen ? "dark" : "light"}
      />
      <Text style={elements.wardrobeTitle}>Mon Armoire</Text>
      {isLoading ? <ActivityIndicator size="large" color="#f3f5ff" /> : null}
      {error ? (
        <View>
          <Text>Une erreur est survenue</Text>
          <Text>{error.message}</Text>
          <TouchableOpacity onPress={refetch}>
            <Text>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        numColumns={2}
        columnWrapperStyle={elements.wardrobeGridItem}
        data={data}
        keyExtractor={(item) => String(item?.id ?? item?.name ?? Math.random())}
        renderItem={({ item }) => (
          <WardrobeItem item={item} onPress={() => openClothingModal(item)} />
        )}
      />

      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={handleModalDismiss}
      >
        <View style={elements.wardrobeModalBackdrop}>
          <Pressable
            style={elements.wardrobeModalDismissArea}
            onPress={handleModalDismiss}
          />

          <View style={elements.wardrobeModalContent}>
            <View style={elements.wardrobeModalHeader}>
              <View style={elements.wardrobeModalHeaderTopRow}>
                <Text style={elements.wardrobeModalTitle}>
                  {isEditModalOpen
                    ? "Modifier le vêtement"
                    : (selectedClothing?.name ?? "Détail du vêtement")}
                </Text>

                <View style={elements.wardrobeModalActions}>
                  {!isEditModalOpen ? (
                    <TouchableOpacity
                      style={elements.wardrobeModalIconButton}
                      onPress={handleEditPress}
                      activeOpacity={0.82}
                    >
                      <Pencil size={18} color="#f3f5ff" />
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={elements.wardrobeModalIconButton}
                    onPress={isEditModalOpen ? closeEditModal : handleClosePress}
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
                source={{ uri: currentEditPreviewUri }}
                style={elements.wardrobeModalImage}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={openEditImageLibrary}
                  activeOpacity={0.85}
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

              {!isEditModalOpen ? (
                <>
                  <View style={elements.wardrobeModalInfoList}>
                    {modalInfoEntries.map(([key, value]) => (
                      <View key={key} style={elements.wardrobeModalInfoRow}>
                        <Text style={elements.wardrobeModalInfoKey}>{key}</Text>
                        <Text style={elements.wardrobeModalInfoValue}>
                          {value == null
                            ? "-"
                            : typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      elements.wardrobeModalBottomDeleteButton,
                      elements.wardrobeModalActionDelete,
                    ]}
                    onPress={handleDeletePress}
                    activeOpacity={0.86}
                  >
                    <Text style={elements.wardrobeModalActionText}>Supprimer</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Animated.View
                  style={{
                    opacity: editOpacity,
                    transform: [{ translateY: editTranslateY }],
                  }}
                >
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
                    disabled={isSavingEdit}
                  >
                    <Text style={elements.wardrobeModalActionText}>
                      {isSavingEdit ? "Enregistrement..." : "Enregistrer"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <View style={elements.wardrobeModalBackdrop}>
          <Pressable style={elements.wardrobeModalDismissArea} onPress={closeAddModal} />

          <Animated.View
            style={[
              elements.wardrobeModalContent,
              {
                opacity: addOpacity,
                transform: [{ translateY: addTranslateY }],
              },
            ]}
          >
            <View style={elements.wardrobeModalHeader}>
              <View style={elements.wardrobeModalHeaderTopRow}>
                <Text style={elements.wardrobeModalTitle}>Ajouter un vêtement</Text>

                <View style={elements.wardrobeModalActions}>
                  <TouchableOpacity
                    style={elements.wardrobeModalIconButton}
                    onPress={closeAddModal}
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
                source={{
                  uri: newClothing.image_url?.trim()
                    ? newClothing.image_url.trim()
                    : "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
                }}
                style={elements.wardrobeModalImage}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={openImageLibrary}
                  activeOpacity={0.85}
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
                  onPress={openCamera}
                  activeOpacity={0.85}
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
                      onChangeText={(text) =>
                        handleAddFieldChange("temperature_min", text)
                      }
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
                      onChangeText={(text) =>
                        handleAddFieldChange("temperature_max", text)
                      }
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
                    onPress={() =>
                      handleAddFieldChange("is_waterproof", !newClothing.is_waterproof)
                    }
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
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const WardrobeItem = ({ item, onPress }) => (
  <TouchableOpacity
    style={elements.wardrobeItemCard}
    onPress={onPress}
    activeOpacity={0.85}
  >
    {/* <View  /> */}
    <View style={elements.wardrobeImagePlaceholder}>
      <Image
        resizeMode="cover"
        source={{
          uri: "https://media1.tenor.com/m/wb_rblUTxVAAAAAd/boat-kid-aura-farming-pacu-jalur.gif",
        }}
        style={elements.wardrobeItemImage}
      />
    </View>
    <Text style={elements.wardrobeItemTitle}>{item.name}</Text>
  </TouchableOpacity>
);
